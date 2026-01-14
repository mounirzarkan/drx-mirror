'use restrict';

const axios = require('axios');
const log = require('../util/logUtil.js');
const utils = require('../util/utils.js');
const {
  calculateAgeBasedAccess,
  calculateAppClaims
} = require('../util/calculateAppClaims.js');
const {BOOMIConnector} = require('../connector/index.js');
const {jwtDecode} = require('jwt-decode');

const JWT_NAMESPACE = 'https://www.cochlear.com';
const JWT_COCHLEAR_ID = `${JWT_NAMESPACE}/cochlear_id`;
const JWT_COCHLEAR_USER_TYPE = `${JWT_NAMESPACE}/user_type`;
const JWT_COCHLEAR_COUNTRY_CODE = `${JWT_NAMESPACE}/country_code`;
const JWT_LOCALE = 'locale';
const SESSION_BLACKLIST_PREFIX = 'drxSessionBlacklist_';
const REFRESH_TOKEN_PREFIX = 'drxRefreshTokenPrefix_';
const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';
const PATIENT_ATTRIBUTES_PREFIX = 'drxPatientAttributesPrefix_';
const USER_ACCOUNT_KEY_PREFIX = 'account-getAccount-';

function getAuth0LoginURL(config) {
  log.info('Input Parameters: ');
  log.info(config);

  // https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-auth-code-flow
  const host = config.auth0CustomDomain || config.auth0Host;
  const scope = 'openid profile email offline_access';
  const app = config.app || 'dcx';
  const connectionName = config.auth0ProfessionalApps?.includes(app)
    ? config.auth0ProfessionalConnectionName
    : config.auth0RecipientConnectionName;
  const state = Buffer.from(JSON.stringify({app})).toString('base64');

  const loginUrl =
    `${host}` +
    `${config.auth0AuthorizePath}` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(config.auth0ClientId)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(config.auth0RedirectUri)}` +
    `&audience=${encodeURIComponent(config.auth0Audience)}` +
    `&state=${encodeURIComponent(state)}` +
    `&connection=${connectionName}` +
    `&app=${app}`; // drx specific params

  log.info(`Login URL: ${loginUrl}`);

  return loginUrl;
}

async function getToken(code, params) {
  log.info(`Verifying Auth0 code: ${code}`);
  log.info('Input Params: ');
  log.info(params);

  // These are set in the auth/parameters/variables-${env}.json file (note: this is a symlink)
  const url = params.auth0Host + params.auth0TokenPath;
  const clientId = params.auth0ClientId;
  const clientSecret = params.auth0ClientSecret; // This is taken from AWS Secrets Manager -> drx/${env}/serverless/secrets -> auth_clientSecret
  const redirectUri = params.auth0RedirectUri;

  log.info(`Calling URL: ${url}`);
  const options = {
    method: 'POST',
    url,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri
    })
  };

  let response;

  try {
    response = await axios.request(options);
    log.info('Got response: ');
    log.info(response.data);
  } catch (e) {
    console.error('Error', e);
    throw e;
  }

  const token = {
    accessToken: response.data['access_token'],
    idToken: response.data['id_token']
  };

  const decoded = jwtDecode(await response.data['id_token']);
  const cochlearId = decoded[JWT_COCHLEAR_ID];
  const userType = decoded[JWT_COCHLEAR_USER_TYPE];
  const countryCode = decoded[JWT_COCHLEAR_COUNTRY_CODE];
  const locale = decoded[JWT_LOCALE];

  const drxRefreshTokenPrefix =
    params.userSessionPrefix + REFRESH_TOKEN_PREFIX + cochlearId;
  const drxAccessTokenPrefix =
    params.userSessionPrefix + ACCESS_TOKEN_PREFIX + cochlearId;
  const drxPatientAttributesPrefix =
    params.userSessionPrefix + PATIENT_ATTRIBUTES_PREFIX + cochlearId;

  log.debug('drxAccessTokenPrefix');
  log.debug(drxAccessTokenPrefix);

  try {
    // store refresh token and access token in cache
    log.info(`Storing refresh token and access token in session cache`);
    await Promise.all([
      params.cache.save(
        drxRefreshTokenPrefix,
        response.data['refresh_token'],
        parseInt(params.userSessionSeconds, 10)
      ),
      params.cache.save(
        drxAccessTokenPrefix,
        response.data['access_token'],
        parseInt(params.userSessionSeconds, 10)
      )
    ]);
    log.info(
      `Stored refresh token and access token in cache for user: ${cochlearId}`
    );
  } catch (e) {
    log.error(e);
    throw e;
  }

  let attributes = '';
  let userAccess = utils.isProfessionalUserType(userType) ? 'ro' : '';
  log.debug('userAccess');
  log.debug(userAccess);

  try {
    // get patient attributes from redis cache
    log.info(`Getting patient attributes from cache`);
    attributes = await params.cache.get(drxPatientAttributesPrefix);

    if (attributes) {
      userAccess = JSON.parse(attributes).userAccess;
    }

    log.info(`Received patient attributes from cache for user: ${cochlearId}`);
  } catch (e) {
    log.error(e);
    throw e;
  }

  const isProfessionalUserType = utils.isProfessionalUserType(userType);
  log.debug('isProfessionalUserType');
  log.debug(isProfessionalUserType);

  if (!attributes && !isProfessionalUserType) {
    const boomiConnector = new BOOMIConnector(params, token.accessToken);
    const patient = await boomiConnector.getPatient(cochlearId);

    if (
      patient.personas.includes('Candidate') &&
      !patient.personas.includes('Carer')
    ) {
      const error = new Error('417');
      error.statusCode = 417;
      error.success = false;
      error.errors = [
        {
          title: 'Candidate persona cannot login',
          errorCode: 417,
          detail: {
            countryCode,
            locale
          }
        }
      ];
      throw error;
    }

    userAccess = calculateAgeBasedAccess(
      patient.dateOfBirth,
      userType,
      countryCode
    );

    attributes = JSON.stringify({
      personas: utils.calculatePersonas(userType, patient.personas),
      isDeceased: patient.isDeceased,
      userAccess
    });

    try {
      // store patient attributes in redis cache
      log.info(`Storing patient attributes in cache`);
      await params.cache.save(
        drxPatientAttributesPrefix,
        attributes,
        parseInt(params.userSessionSeconds, 10)
      );
      log.info(`Stored patient attributes in cache for user: ${cochlearId}`);
    } catch (e) {
      log.error(e);
      throw e;
    }
  }

  token.attributes = attributes;

  const appClaims = await calculateAppClaims({
    userType,
    countryCode,
    userAccess
  });

  token.app = appClaims;

  log.info('Returning token: ');
  log.info(token);
  return token;
}

async function revokeToken(token, params) {
  // Revoking of access and id tokens isn't supported by auth0, so we'll just add the session id to our blacklist to
  // prevent it from being used if the user has opted to logout via the front-end
  // Once refresh tokens are implemented, this will also take a refresh token and that would be revoked

  const decoded = jwtDecode(token);
  log.debug('Got decoded token');

  const drxRefreshTokenPrefix =
    params.userSessionPrefix + REFRESH_TOKEN_PREFIX + decoded[JWT_COCHLEAR_ID];
  const sessionBlackListKey = SESSION_BLACKLIST_PREFIX + decoded.sid;

  console.debug('drxRefreshTokenPrefix');
  console.debug(drxRefreshTokenPrefix);

  const drxUserAccountPrefix =
    params.userSessionPrefix +
    USER_ACCOUNT_KEY_PREFIX +
    decoded[JWT_COCHLEAR_ID] +
    '-' +
    decoded[JWT_COCHLEAR_ID];

  console.debug('drxUserAccountPrefix');
  console.debug(drxUserAccountPrefix);

  const inSession = await isInSession(sessionBlackListKey, params.cache);
  if (inSession) {
    try {
      // clear account cache & revoke refresh when user logs out.
      await Promise.all([
        params.cache.delete(drxUserAccountPrefix),
        params.cache.delete(drxRefreshTokenPrefix),
        params.cache.save(
          sessionBlackListKey,
          'loggedOut',
          parseInt(params.blacklistSeconds)
        )
      ]);
    } catch (e) {
      log.error(e);
      throw e;
    }
  }

  /*
  const url = params.auth0Host + params.auth0RevokePath;
  const clientId = params.auth0ClientId;
  const clientSecret = params.auth0ClientSecret; // This is taken from AWS Secrets Manager -> drx/${env}/serverless/secrets -> auth_clientSecret

  const options = {
    method: 'POST',
    url,
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      token: token
    })
  };

  let response;
  try {
    response = await axios.request(options);
    log.info('Got response: ');
    log.info(response.data);
  } catch (e) {
    console.error('Error', e);
    throw e;
  }

  return {
    statusCode: 200,
    body: null
  };
   */

  // The original revoke function
  /*
  const decoded = verifyJWTSessionToken(
    params._publicKey,
    params._aws_secret.encryptKey,
    token
  );

  const sessionBlackListKey = SESSION_BLACKLIST_PREFIX + decoded.sid;
  const inSession = await isInSession(sessionBlackListKey, params._cache);

  if (inSession) {
    // log.debug('decoded Token:');
    // log.debug(decoded);

    const auth_time = parseInt(decoded.auth_time, 10);
    if (auth_time + params._blackListSeconds <= Math.floor(Date.now() / 1000)) {
      log.debug('no need to call sf revoke');
    } else {
      const jsonForm = {
        token: decoded[JWT_SF_TOKEN]
      };
      try {
        console.time('SF-revokeTokenCall');
        await axios({
          method: 'post',
          url: params._sf_host + params._sf_path_revoke,
          data: stringify(jsonForm),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.timeEnd('SF-revokeTokenCall');
      } catch (error) {
        log.error('error when call sf toke revoke: ');
        log.error(error);
        // log the error, continue to blacklist session
      }
    }
    await params._cache.save(
      sessionBlackListKey,
      'loggedOut',
      parseInt(params._blacklistSeconds)
    );
  }
   */
}

async function isInSession(sessionKey, cache) {
  console.time('Redis-sessionBlackList');
  const sessionBlacklist = await cache.get(sessionKey);
  console.timeEnd('Redis-sessionBlackList');

  if (sessionBlacklist) {
    log.debug('user not in session, blacklisted.');
    return false;
  } else {
    log.debug('user in session, not blacklisted.');
    return true;
  }
}

module.exports = {
  getAuth0LoginURL,
  getToken,
  revokeToken
};

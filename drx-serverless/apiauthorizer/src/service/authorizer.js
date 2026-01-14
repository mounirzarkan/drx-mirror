'use strict';

const _ = require('lodash');
const axios = require('axios');
const jsonwebtoken = require('jsonwebtoken');
const log = require('../util/logUtil.js');
const {isProfessionalUserType} = require('../util/utils.js');
const {calculateAppClaims} = require('../util/calculateAppClaims.js');
const {renewJWTSessionToken} = require('../connector/jwt.js');

const JWT_NAMESPACE = 'https://www.cochlear.com';
const JWT_COCHLEAR_ID = `${JWT_NAMESPACE}/cochlear_id`;
const JWT_SF_TOKEN = `${JWT_NAMESPACE}/sf_token`;
const JWT_COUNTRY = `${JWT_NAMESPACE}/country_code`;
const JWT_USERTYPE = `${JWT_NAMESPACE}/user_type`;
const JWT_ACT = `${JWT_NAMESPACE}/act`;
const SESSION_BLACKLIST_PREFIX = 'drxSessionBlacklist_';
const REFRESH_TOKEN_PREFIX = 'drxRefreshTokenPrefix_';
const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';
const PATIENT_ATTRIBUTES_PREFIX = 'drxPatientAttributesPrefix_';

module.exports.authorize = async function (
  method,
  idToken,
  queryId,
  policyResource,
  resource,
  path,
  cache,
  params
) {
  log.info(`Validating Auth0 Id token: ${idToken}`);
  log.info('Input Parameters: ');
  log.info(params);

  // Collect the public certificate to validate the JWT token
  const signingCert = await getSigningCert(idToken, policyResource, params);

  try {
    const audience = params._auth0_audience;
    log.info(`Auth0 API Audience: ${audience}`);

    const decoded = jsonwebtoken.verify(idToken, signingCert, {aud: audience});

    const cochlearId = decoded[JWT_COCHLEAR_ID];
    log.info(`(Unencrypted) Cochlear Id: ${cochlearId}`);

    const countryCode = decoded[JWT_COUNTRY];
    log.info(`countryCode: ${cochlearId}`);

    const userType = decoded[JWT_USERTYPE];
    log.info(`userType: ${userType}`);

    // Check if blacklisted
    log.debug('check if blacklisted');
    const blackListed = await isBlackListed(decoded, cache);
    if (blackListed) {
      log.debug('is blacklisted:' + blackListed);
      return generateDeny(idToken, policyResource);
    }

    // Check if authorized
    log.debug('check if authorized');
    const accessToken = await cache.get(
      params._userSessionPrefix + ACCESS_TOKEN_PREFIX + cochlearId
    );
    log.debug(`get accessToken from cache: ${accessToken}`);

    const decodedAccessToken = jsonwebtoken.verify(accessToken, signingCert, {
      aud: audience
    });
    log.debug(`decoded accessToken: ${decodedAccessToken}`);

    let allowList = [];

    if (decodedAccessToken[JWT_ACT] && decodedAccessToken[JWT_ACT].sub) {
      allowList = decodedAccessToken[JWT_ACT].sub;
    }

    allowList = Array.isArray(allowList) ? allowList : [allowList];

    if (!allowList.includes(cochlearId)) {
      allowList.push(cochlearId);
    }
    log.debug(`allowList: ${allowList}`);

    if (!allowList.includes(queryId)) {
      log.debug('is not authorized');
      return generateDeny(idToken, policyResource);
    }

    // Check if has dm or prof-store app claim
    log.debug('check patient attributes, to calculate app claims');
    const attributes = await cache.get(
      params._userSessionPrefix + PATIENT_ATTRIBUTES_PREFIX + cochlearId
    );
    log.debug(`get attributes from cache: ${attributes}`);

    const parsedAttributes = JSON.parse(attributes);
    log.debug(`parsed attributes: ${parsedAttributes}`);

    const profAccess = isProfessionalUserType(userType) ? 'ro' : '';
    log.debug('profAccess');
    log.debug(profAccess);

    const appClaims = await calculateAppClaims({
      userType,
      countryCode,
      userAccess: parsedAttributes?.userAccess || profAccess
    });
    log.debug(`appClaims: ${appClaims}`);

    const permissions = appClaims.split(',') || [];
    log.debug(`permissions: ${permissions}`);

    if (!permissions.includes('dm') && !permissions.includes('prof-store')) {
      log.debug('does not have the minimum app claims');
      return generateDeny(idToken, policyResource);
    }

    // TODO this is used by the userid code (only!) - we need to work out where this information comes from
    const _decryptedIdMap = decoded['_decryptedIdMap'] || {};

    const authResponse = generateAllow(cochlearId, policyResource);

    log.info(`Fetching refresh token from cache for user: ${cochlearId}`);
    const refreshToken = await cache.get(
      params._userSessionPrefix + REFRESH_TOKEN_PREFIX + cochlearId
    );
    log.info(`Fetched refresh Token`);

    const client = {
      client_id: params._auth0_client_id,
      client_secret: params._client_secret,
      client_hostname: params._auth0_host
    };

    const renewedIdToken = await renewJWTSessionToken(
      {idToken, refreshToken},
      decoded.exp,
      client,
      cochlearId,
      cache,
      params
    );

    authResponse.context = {
      jwtToken: renewedIdToken,
      sub: cochlearId, // As the current code is expecting the sub to be the cochlear id
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      email: decoded.email, // This requires scope to include "email" in the request
      locale: decoded.locale,
      countryCode: decoded[JWT_COUNTRY],
      auth_time: decoded['iat'],
      sf_token: decoded[JWT_SF_TOKEN],
      sid: decoded.sid, // 'fef6cbcb-f254-4894-a11d-81c37a02fca5',
      userType: decoded[JWT_USERTYPE],
      _decryptedIdMap: JSON.stringify(_decryptedIdMap)
    };

    if (queryId && !_.isEmpty(queryId)) {
      authResponse.context.obj = queryId; // left unencrypted to match the sub in checks
    }

    log.info(`Returning authResponse: ${authResponse}`);

    return authResponse;
  } catch (e) {
    log.error('Error decoding JWT:');
    console.error(e);
    return generateDeny(idToken, policyResource);
  }
};

const getSigningCert = async (token, policyResource, params) => {
  // See here for info on validating access tokens
  // https://auth0.com/docs/secure/tokens/access-tokens/validate-access-tokens

  // We can collect the public certificate from the jwks.json (config url shown here for reference)
  // https://cochlear-poc.au.auth0.com/.well-known/oicd-configuration
  // https://cochlear-poc.au.auth0.com/.well-known/jwks.json
  const jwksUrl = `${params._auth0_host}/.well-known/jwks.json`;
  log.info(`JWKS URL: ${jwksUrl}`);

  try {
    const options = {
      method: 'GET',
      url: jwksUrl
    };

    const response = await axios.request(options);
    log.info('Got response: ');
    log.info(response.data);

    if (response.data.keys && response.data.keys.length > 0) {
      // Note: the assumption is there are 2 keys returned - the first one is the currently used
      // key, and the one we want, and the 2nd one is the next in the queue
      const signingCert = response.data.keys[0]['x5c'];
      if (signingCert) {
        const SIGNING_CERT = `-----BEGIN CERTIFICATE-----\n${signingCert}\n-----END CERTIFICATE-----`;
        log.info(`Returning Signing Cert: ${SIGNING_CERT}`);
        return SIGNING_CERT;
      }
    }

    log.error('Unable to obtain key from list of keys: ');
    log.error(response.data.keys);
    return generateDeny(token, policyResource);
  } catch (e) {
    log.error('Error returning Signing Certificate:');
    log.error(e);
    return generateDeny(token, policyResource);
  }
};

// Help function to generate an IAM policy
const generatePolicy = function (principalId, effect, policyResource) {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && policyResource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = policyResource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const generateAllow = function (principalId, policyResource) {
  return generatePolicy(principalId, 'Allow', policyResource);
};

const generateDeny = function (principalId, policyResource) {
  return generatePolicy(principalId, 'Deny', policyResource);
};

async function isBlackListed(decoded, cache) {
  const sessionId = decoded.sid;
  console.time('Redis-sessionBlackList');
  const sessionBlacklist = await cache.get(
    SESSION_BLACKLIST_PREFIX + sessionId
  );
  console.timeEnd('Redis-sessionBlackList');
  // console.debug('blacklist key: ', SESSION_BLACKLIST_PREFIX + sessionId);
  console.debug('sessionBlacklist: ', sessionBlacklist);
  if (sessionBlacklist) {
    log.debug('user blacklisted.');
    return true;
  } else {
    log.debug('user not blacklisted.');
    return false;
  }
}

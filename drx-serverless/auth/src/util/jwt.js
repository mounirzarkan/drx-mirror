'use strict';

const jsonwebtoken = require('jsonwebtoken');
const _sign = jsonwebtoken.sign;
const verify = jsonwebtoken.verify;
const {generateTokenId, generateSessionId} = require('./utils.js');
const {encrypt, decrypt} = require('./encrypt.js');
const log = require('./logUtil.js');

const JWT_NAMESPACE = 'https://www.cochlear.com';
const JWT_SF_TOKEN = `${JWT_NAMESPACE}/sf_token`;
const JWT_USERTYPE = `${JWT_NAMESPACE}/user_type`;
const JWT_COUNTRY = `${JWT_NAMESPACE}/country_code`;
const JWT_APP = `${JWT_NAMESPACE}/app`;
const JWT_CARER = `${JWT_NAMESPACE}/carer`;
const JWT_RECIPIENT = `${JWT_NAMESPACE}/recipient`;
const SESSION_LENGTH = parseInt(process.env.userSessionSeconds, 10);

function signJWT(privateKey, sub, data) {
  log.debug('data before signed:');
  log.debug(data);
  return _sign(data, privateKey, {
    algorithm: 'RS256',
    expiresIn: SESSION_LENGTH,
    issuer: JWT_NAMESPACE,
    subject: sub,
    jwtid: generateTokenId()
  });
}

function getJWTSessionToken(_signKey, _encryptKey, claims) {
  if (!_signKey || !_encryptKey || !claims._cochlearId) {
    throw new Error('signKey, encryptKey, cochlearId cant be null');
  }
  const data = {
    sid: generateSessionId(),
    given_name: claims._firstName,
    family_name: claims._lastName,
    locale: claims._languageCode,
    auth_time: Math.floor(Date.now() / 1000),
    is_deceased: claims._isDeceased
  };
  data[JWT_COUNTRY] = claims._countryCode;
  data[JWT_SF_TOKEN] = encrypt(_encryptKey, claims._sfToken);
  data[JWT_USERTYPE] = claims._userType;

  if (claims._app) {
    data[JWT_APP] = claims._app;
  }

  if (claims._carers) {
    data[JWT_CARER] = JSON.stringify(claims._carers);
  }

  if (claims._recipients) {
    let recipient;
    for (recipient of claims._recipients) {
      recipient['CochlearId'] = encrypt(_encryptKey, recipient['CochlearId']);
    }
    data[JWT_RECIPIENT] = JSON.stringify(claims._recipients);
  }

  log.debug('data: ');
  log.debug(data);
  return signJWT(_signKey, encrypt(_encryptKey, claims._cochlearId), data);
}

function verifyToken(encoded, publicKey) {
  return verify(encoded, publicKey, {
    algorithm: 'RS256',
    issuer: JWT_NAMESPACE
  });
}

// TODO no longer used after the auth0 changes - can be removed
function verifyJWTSessionToken(publicKey, encryptKey, encoded) {
  const decoded = verifyToken(encoded, publicKey);

  const encryptedSub = decoded.sub;
  decoded.sub = decrypt(encryptKey, encryptedSub);
  decoded[JWT_SF_TOKEN] = decrypt(encryptKey, decoded[JWT_SF_TOKEN]);
  if (decoded[JWT_RECIPIENT]) {
    const recipients = JSON.parse(decoded[JWT_RECIPIENT]);
    let recipient;
    for (recipient of recipients) {
      recipient['CochlearId'] = decrypt(encryptKey, recipient['CochlearId']);
    }
    decoded[JWT_RECIPIENT] = JSON.stringify(recipients);
  }
  return decoded;
}

// TODO no longer used after the auth0 changes - can be removed
function renewJWTSessionToken(signKey, encryptKey, token) {
  const data = {
    sid: token.sid,
    given_name: token.given_name,
    family_name: token.family_name,
    locale: token.locale,
    auth_time: token.auth_time,
    is_deceased: token.is_deceased
  };
  data[JWT_COUNTRY] = token[JWT_COUNTRY];
  data[JWT_USERTYPE] = token[JWT_USERTYPE];
  data[JWT_SF_TOKEN] = encrypt(encryptKey, token[JWT_SF_TOKEN]);
  if (token[JWT_APP]) {
    data[JWT_APP] = token[JWT_APP];
  }
  if (token[JWT_CARER]) {
    data[JWT_CARER] = token[JWT_CARER];
  }
  if (token[JWT_RECIPIENT]) {
    const recipients = JSON.parse(token[JWT_RECIPIENT]);
    let recipient;
    for (recipient of recipients) {
      recipient['CochlearId'] = encrypt(encryptKey, recipient['CochlearId']);
    }
    data[JWT_RECIPIENT] = JSON.stringify(recipients);
  }
  const renewed = signJWT(signKey, encrypt(encryptKey, token.sub), data);
  return renewed;
}

function containsAppClaim(data, lookUpClaim) {
  if (data && data[JWT_APP]) {
    const claims = data[JWT_APP].split(',');
    return claims.some(
      (claim) => claim.toLowerCase() === lookUpClaim.toLowerCase()
    );
  }
  return false;
}

module.exports = {
  signJWT,
  getJWTSessionToken,
  verifyJWTSessionToken,
  renewJWTSessionToken,
  JWT_NAMESPACE,
  JWT_SF_TOKEN,
  SESSION_LENGTH,
  verifyToken,
  containsAppClaim
};

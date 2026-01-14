'use strict';

const log = require('../util/logUtil.js');
const axios = require('axios');
const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';

function isExpiring(expiryTime, timeframe) {
  const timeTillExpiry = expiryTime - Date.now();
  if (timeTillExpiry < timeframe) {
    return true;
  }
  return false;
}

async function renewJWTSessionToken(
  {idToken, refreshToken},
  expiry,
  client,
  cochlearId,
  cache,
  params
) {
  const timeframe = 15 * 60 * 1000; // 15 minutes in millis
  const tokenExpMillis = expiry * 1000; // convert token expiry from seconds to millis
  const {client_id, client_secret, client_hostname} = client;
  if (!isExpiring(tokenExpMillis, timeframe)) {
    log.info('Id Token not expiring - return existing token');
    return idToken;
  }
  const tokenEndpoint = `${client_hostname}/oauth/token`;
  log.info(
    `Id Token is expiring. Renew token from token endpoint: ${tokenEndpoint}`
  );

  try {
    const options = {
      method: 'POST',
      url: tokenEndpoint,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refreshToken
      }).toString()
    };

    const response = await axios.request(options);
    log.info('Got response from renew token request');

    await cache.save(
      params._userSessionPrefix + ACCESS_TOKEN_PREFIX + cochlearId,
      response.data['access_token'],
      Number.parseInt(params._userSessionSeconds, 10)
    );

    return response.data['id_token'];
  } catch (e) {
    // can't handle the error here, so parse relevant error messages and throw error higher to generateDeny.
    // handling axios errors should move to logUtils as a common error pattern
    if (e && e.response) {
      log.error('Error returning JWT from renewed session token:');
      const errObj = {
        status: e.response.status,
        description: e.response.StatusText,
        data: e.response.data
      };
      log.error(errObj);
    } else {
      log.error(e);
    }
    throw e;
  }
}

module.exports = {
  renewJWTSessionToken
};

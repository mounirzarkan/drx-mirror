'use strict';

const Redis = require('ioredis');
const {authorize} = require('./service/authorizer.js');
const {getTokenValue} = require('./util/utils.js');
const {getSecret} = require('./connector/AWSConnector.js');
const {RedisCache} = require('./connector/cache.js');
const log = require('./util/logUtil.js');
const LOG_EVENTS = require('./data/eventConstants.js');

const init = async (env) => {
  const _paras = {};
  _paras._region = env.region;
  _paras._secretName = env.secretName;
  _paras._redis_port = env.RedisPort;
  _paras._redis_host = env.RedisHostname;
  _paras._publicKey = env.publicKey;

  const secretFromAWS = await getSecret(_paras._region, _paras._secretName);
  // even secret are loaded by different process, it doens't matter.

  _paras._aws_secret = JSON.parse(secretFromAWS);

  _paras._client_secret = _paras._aws_secret.auth_clientSecret;

  _paras._userSessionPrefix = env.userSessionPrefix;
  _paras._userSessionSeconds = env.userSessionSeconds;

  // Required Auth0 environment variables
  _paras._auth0_host = env.auth0Host;
  _paras._auth0_audience = env.auth0Audience;
  _paras._auth0_client_id = env.auth0ClientId;

  return _paras;
};

function initiateCache(_paras) {
  const {IS_LOCAL} = process.env;
  console.log('sls is_local: ', IS_LOCAL);

  const redis = new Redis({
    port: IS_LOCAL ? 6379 : _paras._redis_port,
    host: IS_LOCAL ? 'localhost' : _paras._redis_host,
    password: _paras._aws_secret.redisToken,
    tls: IS_LOCAL ? {rejectUnauthorized: false} : {}
  });

  return new RedisCache(redis);
}

function authenticate(event, context, callback) {
  log.essential(LOG_EVENTS.API_START);
  log.debug(event);
  log.debug(context);

  const authorizationHeader =
    event.headers.Authorization || event.headers.authorization;
  log.debug(`authorizationHeader: ${authorizationHeader}`);

  const token = getTokenValue(authorizationHeader);
  log.debug(`token: ${token}`);

  const queryId = event.queryStringParameters.id;
  const method = event.httpMethod;
  const policyResource = event.methodArn;
  const resource = event.resource;
  const path = event.path;

  log.debug(`api authorizer method: ${method}`);
  log.debug(`api authorizer queryId: ${queryId}`);
  log.debug(`api authorizer policyResource: ${policyResource}`);
  log.debug(`api authorizer resource: ${resource}`);
  log.debug(`api authorizer path: ${path}`);

  init(process.env).then((params) => {
    const cache = initiateCache(params);
    log.debug(`after initWithCache: ${JSON.stringify(params, null, 2)}`);

    params._cache = cache;
    authorize(
      method,
      token,
      queryId,
      policyResource,
      resource,
      path,
      cache,
      params
    )
      .then((policy) => {
        cache.disconnect();

        log.info(`policy: ${JSON.stringify(policy, null, 2)}`);

        if (policy) {
          callback(null, policy);
        } else {
          callback('Unauthorized');
        }
      })
      .catch((err) => {
        cache.disconnect();
        log.error(`err: ${JSON.stringify(err, null, 2)}`);

        if (err.response) {
          log.debug(err.response.data);
          log.debug(err.response.status);
          log.debug(err.response.headers);
        } else if (err.request) {
          log.debug(err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          log.debug(err.message);
        }

        callback('Unauthorized');
      });
  });
}

module.exports = {
  authenticate
};

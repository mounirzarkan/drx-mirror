'use restrict';

const _ = require('lodash');
const Redis = require('ioredis');

const awsConnector = require('./connector/AWSConnector.js');
const {RedisCache} = require('./connector/cache.js');
const log = require('./util/logUtil.js');
const LOG_EVENTS = require('./config/eventConstants.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const contentApiController = require('./controller/contentApiController.js');

const params = {_localParaLoaded: false, _initiated: false};
let cache = null;
const {IS_LOCAL} = process.env;
console.log('sls IS_LOCAL: ', IS_LOCAL);

const init = async (env, _paras = params) => {
  if (!_paras || !_paras._initiated) {
    loadLocalParams(env, _paras);
    console.time('AWS-retrieveSecretFromAWSSecretManager');

    _paras._aws_secret = JSON.parse(
      await awsConnector.getSecret(env.region, env.secretName)
    );
    console.timeEnd('AWS-retrieveSecretFromAWSSecretManager');

    _paras._client_secret = _paras._aws_secret.auth_clientSecret;

    _paras._permissions = _paras._aws_secret.permissions;

    _paras._boomiPassword = _paras._aws_secret.boomiPassword;

    _paras._initiated = true;
    _paras._isScHttpAgent =
      env.isScHttpAgent === 'true' || env.isScHttpAgent === true;
  }
  return _paras;
};

function loadLocalParams(env, _paras) {
  _paras._region = env.region;
  _paras._env = env.Environment;
  _paras._secretName = env.secretName;
  _paras._redis_port = env.RedisPort;
  _paras._redis_host = env.RedisHostname;
  _paras._boomiUsername = env.boomiUsername;
  _paras._cacheSeconds = Number.parseInt(env.cacheSeconds, 10);
  _paras._boomiTokenEndpoint = env.boomiTokenEndpoint;
  _paras._boomiApiEndpoint = env.boomiApiEndpoint;
  _paras._boomiHeaderFooterApiKey = env.boomiApiKey; //"721cbc3c-30b5-46e5-b2d9-6bc9d066ec9b";
  _paras._scApiKey = env.scApiKey;
  _paras._scEndpoint = env.scEndpoint;
  _paras._localParaLoaded = true;
  _paras._isScHttpAgent = true;
  return _paras;
}

async function initiateCache(_paras) {
  log.debug('handler  - getHeaderFooterWithCache - initiate cache : ');
  log.debug(_paras._redis_port);
  log.debug(_paras._redis_host);
  log.debug('_paras._aws_secret.redisToken' + _paras._aws_secret.redisToken);

  const redis = new Redis({
    port: IS_LOCAL ? 6379 : _paras._redis_port,
    host: IS_LOCAL ? 'localhost' : _paras._redis_host,
    password: _paras._aws_secret.redisToken,
    tls: IS_LOCAL ? {rejectUnauthorized: false} : {}
  });

  log.debug('REDIS look into');
  log.debug(redis);

  return new RedisCache(redis);
}

async function getHeaderFooterWithCache(event, process) {
  if (event.source === 'serverless-plugin-warmup') {
    log.debug('This is a warmup request!');
    return 'Lambda auth token is warm!';
  }

  if (_.isNil(event)) {
    return constructor.getTokenExchangeResponse(400, 'Invalid request.');
  }

  if (!params._initiated) {
    await init(process.env, params);
  }

  if (cache && cache.redis) {
    log.debug('cache.redis.status');
    log.debug(cache.redis.status);
    if (
      cache.redis.status === 'connect' ||
      cache.redis.status === 'ready' ||
      cache.redis.status === 'connecting'
    ) {
      params._cache = cache;
      log.debug('track 1');
    } else {
      cache.disconnect();
      cache = await initiateCache(params);
      params._cache = cache;
      log.debug('track 2');
    }
  } else {
    cache = await initiateCache(params);
    params._cache = cache;
    log.debug('track 3');
  }

  log.debug('handler - getHeaderFooterWithCache - params: ');
  log.debug(params);

  log.debug('handler - getHeaderFooterWithCache - queryStringParameters: ');
  log.debug(event.queryStringParameters);

  try {
    var request = {
      lng: event.queryStringParameters.lng,
      country: event.queryStringParameters.country
    };

    log.debug('handler - getHeaderFooterWithCache - querystring : ');
    log.debug(request);

    log.debug('handler - getHeaderFooterWithCache - check cache : ');
    log.debug(params._cache);
    log.debug(params._cache.redis.status);

    const data = await contentApiController.getHeaderFooter(request, params);
    log.debug('handler - getHeaderFooterWithCache - data: ');
    log.debug(data);

    const response = constructor.getTokenExchangeResponse(
      200,
      JSON.stringify(data)
    );

    return response;
  } catch (error) {
    log.error('handler - getHeaderFooterWithCache - ERROR: ');
    log.error(error);

    if (error.response) {
      log.debug(error.response.data);
      log.debug(error.response.status);
      log.debug(error.response.headers);
    } else if (error.request) {
      log.debug(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      log.debug(error.message);
      if (_.includes(error.message, 'jwt') || _.isEqual(error.message, '400')) {
        return constructor.getTokenExchangeResponse(400, 'invalid token');
      } else if (_.isEqual(error.message, '403')) {
        return constructor.getTokenExchangeResponse(403, 'Forbidden');
      }
    }

    if (error.statusCode) {
      return constructor.getTokenExchangeResponse(
        error.statusCode,
        'Bad request'
      );
    }

    return constructor.getTokenExchangeResponse(500, 'Internal Server Error');
  }
}

async function getHeaderFooter(event) {
  log.info('getHeaderFooter request start');
  log.essential(LOG_EVENTS.API_START);

  log.debug('event: ');
  log.debug(event);

  log.debug('process.versions: ');
  log.debug(process.versions);

  log.debug('process.env: ');
  log.debug(process.env);

  return await getHeaderFooterWithCache(event, process);
}

function logger() {
  log.info('this is a test log event (info)');
  log.debug('this is a test log event (debug)');
  log.error('this is a test log event (error)');
  log.essential('this is a test log event (essential)');
}

module.exports = {
  getHeaderFooter,
  logger
};

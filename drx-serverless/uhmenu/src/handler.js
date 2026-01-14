'use strict';

const contentApiController = require('./controller/contentApiController.js');
const log = require('./util/logUtil.js');
const LOG_EVENTS = require('./data/eventConstants.js');
const {RedisCache} = require('./connector/cache.js');
const Redis = require('ioredis');
const constructor = require('./constructor/responsePayloadConstructor.js');
const awsConnector = require('./connector/AWSConnector.js');
const {getDefaultLanguage} = require('./util/utils.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

const params = {_localParaLoaded: false, _initiated: false};
let cache = null;

function initiateCache(_params) {
  log.debug('_params - initiateCache:');
  log.debug(_params);

  const redis = new Redis({
    port: IS_LOCAL ? 6379 : _params._redis_port,
    host: IS_LOCAL ? 'localhost' : _params.redis_host,
    password: _params.sf_secret.redisToken,
    tls: IS_LOCAL ? {rejectUnauthorized: false} : {}
  });

  return new RedisCache(redis);
}

async function loadParams(env, _paras = params) {
  _paras.region = env.region;
  _paras.secretName = env.SMSFIntegration;
  _paras.redisTokenKey = env.redisTokenKey;
  _paras.userSessionPrefix = env.userSessionPrefix;
  _paras.userSessionSeconds = Number.parseInt(env.userSessionSeconds, 10);
  _paras.tokenSessionSeconds = Number.parseInt(env.tokenSessionSeconds, 10);
  _paras.redis_port = env.RedisPort; // Redis port
  _paras.redis_host = env.RedisHostname; // Redis host
  _paras.releaseVersion = env.releaseVersion;
  _paras.sc_endpoint = env.SCEndpoint;
  _paras._env = env.Environment;
  _paras._localParaLoaded = true;

  log.debug('_paras - loadParams:');
  log.debug(_paras);

  // will need to be refactored.
  const secretString = await awsConnector.getSecret(
    _paras.region,
    _paras.secretName
  );

  log.debug('secretString - loadParams:');
  log.debug(secretString);
  _paras.sf_secret = JSON.parse(secretString);

  log.debug('params after added secretString - loadParams:');
  log.debug(_paras);

  _paras._initiated = true;
  _paras._isScHttpAgent =
    env.isScHttpAgent === 'true' || env.isScHttpAgent === true;
  return _paras;
}

async function getHeader(event) {
  log.essential(LOG_EVENTS.API_START);
  /** Immediate response for WarmUP plugin */
  // if (event.source === 'serverless-plugin-warmup') {
  //   log.debug('This is a warmup request!');
  //   return callback(null, 'Lambda getHeader is warm!');
  // }
  // return 'hello';
  if (!params._initiated) {
    await loadParams(process.env, params);
  }

  if (cache && cache.redis) {
    log.debug('cache.redis.status');
    log.debug(cache.redis.status);
    if (
      cache.redis.status === 'connect' ||
      cache.redis.status === 'ready' ||
      cache.redis.status === 'connecting'
    ) {
      params.cacheRepo = cache;
      log.debug('track 1');
    } else {
      cache.disconnect();
      cache = initiateCache(params);
      params.cacheRepo = cache;
      log.debug('track 2');
    }
  } else {
    cache = initiateCache(params);
    params.cacheRepo = cache;
    log.debug('track 3');
  }

  log.debug('handler - getHeader - check cache : ');
  log.debug(params.cacheRepo);
  log.debug(params.cacheRepo.redis.status);

  if (
    event.requestContext.authorizer.sub !== event.requestContext.authorizer.obj
  ) {
    log.debug(
      `Not Authorized to Query: event.requestContext.authorizer.sub !== event.requestContext.authorizer.obj (i.e. values: ${event.requestContext.authorizer.sub} !== ${event.requestContext.authorizer.obj})`
    );

    const body = constructor.getErrorResponse(
      false,
      'Not Authorized to query',
      '403',
      'Not Authorized to query'
    );
    const bodyString = JSON.stringify(body);
    const headers = constructor.getResponseHeaders({
      Authorization: event.requestContext.authorizer.jwtToken
    });

    return constructor.getResponseObj('403', bodyString, headers);
  }

  try {
    const app =
      (event.queryStringParameters && event.queryStringParameters.app) || 'gs';

    let lng = event.queryStringParameters && event.queryStringParameters.lng;

    const personas =
      (event.queryStringParameters && event.queryStringParameters?.personas) ||
      '';
    const personasArray = personas
      ? personas.split(',').map((persona) => persona.toLowerCase())
      : [];

    log.debug('headerList - getHeader: app');
    log.debug(app);

    log.debug('headerList - getHeader: lng');
    log.debug(lng);

    log.debug('headerList - getHeader: personas');
    log.debug(personasArray);

    log.debug('headerList - getHeader: params');
    log.debug(params);

    if (!lng) {
      lng = getDefaultLanguage(
        event.requestContext.authorizer.countryCode,
        params.sf_secret.englishSpeakingCountries.split(',')
      );
    }

    const headerList = await contentApiController.getHeader(
      event.requestContext.authorizer,
      params,
      lng,
      app,
      personasArray
    );

    log.debug('headerList - getHeader:');
    log.debug(headerList);

    const dataResponse = constructor.getUHmenuDataResponse(true, headerList);

    log.debug('dataResponse - getHeader:');
    log.debug(dataResponse);

    const dataResponseStr = JSON.stringify(dataResponse);
    const headers = constructor.getResponseHeaders({
      Authorization: event.requestContext.authorizer.jwtToken
    });

    log.debug('headers - getHeader:');
    log.debug(headers);

    return constructor.getResponseObj('200', dataResponseStr, headers);
  } catch (err) {
    log.error('error caught getHeader: ');
    log.error(err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      log.debug(err.response.data);
      log.debug(err.response.status);
      log.debug(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      log.debug(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      log.debug(err.message);
    }
    const statusCode = '500';
    const title = 'Internal Server Error';
    const errorCode = '500';
    const detail = 'Internal Server Error';

    const body = constructor.getErrorResponse(false, title, errorCode, detail);
    const bodyString = JSON.stringify(body);
    const headers = constructor.getResponseHeaders({
      Authorization: event.requestContext.authorizer.jwtToken
    });

    return constructor.getResponseObj(statusCode, bodyString, headers);
  }
}

module.exports = {
  getHeader
};

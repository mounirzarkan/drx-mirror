'use restrict';

const _ = require('lodash');
const log = require('../util/logUtil.js');
const ContentService = require('../service/contentService.js');
const CacheKeyService = require('../service/cacheKeyService.js');

async function getHeaderFooter(request, params) {
  const cacheKeyService = new CacheKeyService(params);
  const cacheSeconds = params._cacheSeconds;

  log.debug(
    'ContentApiController - getHeaderFooter - cacheSeconds:',
    cacheSeconds
  );

  const contentService = new ContentService(params);

  //get from cache
  const cacheKey = cacheKeyService.getBoomiHeaderFooterKey(
    request.lng,
    request.country
  );
  log.debug('ContentApiController - getHeaderFooter - cacheKey:' + cacheKey);
  log.debug('ContentApiController - getHeaderFooter - cache:');
  log.debug(params._cache.status);

  let resp = await params._cache.get(cacheKey);
  log.debug('ContentApiController - getHeaderFooter - cached value:');
  log.debug(resp);

  if (!_.isEmpty(resp)) {
    resp = JSON.parse(resp);
    log.debug('ContentApiController - getHeaderFooter - get from cache:');
  } else {
    log.debug('ContentApiController - getHeaderFooter - get from service:');

    resp = await contentService.getHeaderFooter(request.lng, request.country);
    await saveInCache(cacheKey, resp, cacheSeconds, params._cache);

    log.debug(resp);
  }

  return resp;
}

async function saveInCache(id, value, expiresInSeconds, cache) {
  log.debug('ContentApiController - saveInCache - start:');
  log.debug(id);
  log.debug(value);
  log.debug(expiresInSeconds);

  try {
    const strValue = JSON.stringify(value);
    const saved = await cache.save(id, strValue, expiresInSeconds);
    const resp = JSON.parse(strValue);
    log.debug('ContentApiController - getHeaderFooter - saved in cache:');
    log.debug(saved);

    return resp;
  } catch (error) {
    log.debug('ContentApiController - saveInCache - ERROR:');
    log.debug(error);
  }
}

module.exports = {getHeaderFooter};

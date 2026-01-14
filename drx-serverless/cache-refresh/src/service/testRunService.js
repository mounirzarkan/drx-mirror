'use strict';

const log = require('../util/logUtil.js');
const CacheKeyService = require('./cacheKeyService.js');
class TestRunService {
  constructor(config) {
    this.cache = config.cache;
    this.cacheKeyService = new CacheKeyService(config);
  }

  async getCacheValue(logicName, identity) {
    const testRunCacheKey = this.cacheKeyService.getKey(logicName, identity);

    log.debug('TestRunService.getCacheValue, testRunCacheKey:');
    log.debug(testRunCacheKey);

    const afterDeleteCache = await this.cache.get(testRunCacheKey);

    log.debug('TestRunService.getCacheValue, afterDeleteCache:');
    log.debug(afterDeleteCache);
    return afterDeleteCache;
  }

  async postSaveCache(logicName, identity) {
    const testRunCacheKey = this.cacheKeyService.getKey(logicName, identity);

    log.debug('TestRunService.postSaveCache, testRunCacheKey:');
    log.debug(testRunCacheKey);

    const prevValue = await this.cache.get(testRunCacheKey);

    log.debug('TestRunService.postSaveCache, prevValue:');
    log.debug(prevValue);

    const timeStr = Date.now().toString();

    log.debug('TestRunService.postSaveCache, timeStr:');
    log.debug(timeStr);

    await this.cache.save(testRunCacheKey, timeStr, 300);

    const beforeDeleteCache = await this.cache.get(testRunCacheKey);

    log.debug('TestRunService.postSaveCache, beforeDeleteCache:');
    log.debug(beforeDeleteCache);

    const appName = this.cacheKeyService.getAppName();

    log.debug('TestRunService.postSaveCache, appName:');
    log.debug(appName);

    return {
      prevValue: prevValue || 'none',
      saveTimeStr: timeStr,
      beforeDeleteCache: beforeDeleteCache || 'none',
      appName
    };
  }
}

module.exports = TestRunService;

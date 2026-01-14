'use strict';

const {log} = require('../util/index.js');
const CacheKeyService = require('./cacheKeyService.js');
const _ = require('lodash');
const COUNT = 100;

class CacheRefreshService {
  constructor(config) {
    this.cache = config.cache;
    this.cacheKeyService = new CacheKeyService(config);
  }

  async deleteCache(prefixName, appName, logicName) {
    const originalKeyPattern = this.cacheKeyService.getOriginalWildcardPattern(
      prefixName,
      appName,
      logicName
    );

    log.debug('CacheRefreshService.deleteCache, originalKeyPattern:');
    log.debug(originalKeyPattern);

    const keyPattern = this.cacheKeyService.getWildcardPattern(
      prefixName,
      appName,
      logicName
    );

    log.debug('CacheRefreshService.deleteCache, keyPattern:');
    log.debug(keyPattern);

    console.time('cache.scanKeys');
    const originalKeys = await this.cache.scanKeys(originalKeyPattern, COUNT);
    console.timeEnd('cache.scanKeys');

    log.debug('CacheRefreshService.deleteCache, originalKeys to delete:');
    log.debug(originalKeys);

    console.time('cache.scanKeys');
    const keys = await this.cache.scanKeys(keyPattern, COUNT);
    console.timeEnd('cache.scanKeys');

    log.debug('CacheRefreshService.deleteCache, keys to delete:');
    log.debug(keys);

    const combinedKeys = [...originalKeys, ...keys];

    log.debug('CacheRefreshService.deleteCache, combinedKeys to delete:');
    log.debug(combinedKeys);

    let response = undefined;

    if (combinedKeys.length > 0) {
      const uniqueKeys = _.uniq(combinedKeys);

      log.debug('CacheRefreshService.deleteCache, uniqueKeys to delete:');
      log.debug(uniqueKeys);

      console.time('cache.delete');
      response = await this.cache.delete(uniqueKeys);
      console.timeEnd('cache.delete');
    }

    log.debug('CacheRefreshService.deleteCache, response:');
    log.debug(response);

    return response;
  }
}

module.exports = CacheRefreshService;

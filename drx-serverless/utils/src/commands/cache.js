'use strict';

const _ = require('lodash');
const {log} = require('../common/utils/index.js');
const PREFIX = 'drx-';
const CACHE_KEY_PREFIX = 'cache';

class CacheCommands {
  constructor(config) {
    this.env = config.env;
    this.cache = config.cache;
    this.userSessionSeconds = config.userSessionSeconds;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  async getCache(key) {
    try {
      log.debug('CacheCommands getCache: - key');
      log.debug(key);

      const cacheStr = await this.getFromCache(
        this.env + '_' + PREFIX,
        CACHE_KEY_PREFIX + '_' + key.toLowerCase()
      );

      log.debug('CacheCommands getCache: - cacheStr');
      log.debug(cacheStr);

      if (!_.isEmpty(cacheStr) && !_.isEmpty(JSON.parse(cacheStr))) {
        return JSON.parse(cacheStr);
      } else {
        throw new Error('Not found');
      }
    } catch (e) {
      log.debug('CacheCommands getCache: - error');
      log.debug(e);
      throw new Error('Error fetching from cache');
    }
  }

  async updateCache(payload) {
    try {
      log.debug('CacheCommands updateCache: - payload');
      log.debug(payload);

      const cacheEntry = {
        token: payload.value.token,
        sub: payload.value.sub
      };

      await this.saveInCache(
        this.env + '_' + PREFIX,
        CACHE_KEY_PREFIX + '_' + payload.key,
        cacheEntry,
        this.userSessionSeconds
      );

      return;
    } catch (e) {
      log.debug('CacheCommands updateCache: - error');
      log.debug(e);
      throw new Error('Error updating the cache');
    }
  }
}

module.exports = CacheCommands;

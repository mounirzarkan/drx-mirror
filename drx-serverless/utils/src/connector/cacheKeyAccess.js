const {RedisCache} = require('./cache.js');
const _ = require('lodash');

class CacheKeyAccess extends RedisCache {
  constructor(redis, _env) {
    super(redis);
    this.env = _.toLower(_env);
  }

  getCustomKey(prefix, key) {
    return prefix + key;
  }

  getCustomKeyCache(prefix, key) {
    const cacheKey = this.getCustomKey(prefix, key);
    return super.get(cacheKey);
  }

  saveCustomKeyInCache(prefix, key, value, seconds) {
    const cacheKey = this.getCustomKey(prefix, key);
    return super.save(cacheKey, JSON.stringify(value), seconds);
  }
}

module.exports = CacheKeyAccess;

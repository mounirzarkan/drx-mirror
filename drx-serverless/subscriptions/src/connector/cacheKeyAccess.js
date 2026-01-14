const {RedisCache} = require('./cache.js');

const _ = require('lodash');

const APP_NAME = 'drx-serviceRequests';
const SEPERATOR = '_';

//new CacheKeyAccess(redis,config._env)
class CacheKeyAccess extends RedisCache {
  constructor(redis, _env) {
    super(redis);
    this.env = _.toLower(_env);
  }

  //getCustomKey(this.config.userSessionPrefix,( CACHE_KEY_PREFIX + params.sub + '-' + params.obj))
  getCustomKey(prefix, key) {
    return prefix + key;
  }

  getKey(logicName, identity) {
    return (
      this.env +
      SEPERATOR +
      APP_NAME +
      SEPERATOR +
      logicName +
      SEPERATOR +
      identity
    );
  }

  getCustomKeyCache(prefix, key) {
    const cacheKey = this.getCustomKey(prefix, key);
    return super.get(cacheKey);
  }

  getKeyCache(logicName, identity) {
    const cacheKey = this.getKey(logicName, identity);
    return super.get(cacheKey);
  }

  saveCustomKeyInCache(prefix, key, value, seconds) {
    const cacheKey = this.getCustomKey(prefix, key);
    return super.save(cacheKey, JSON.stringify(value), seconds);
  }

  saveKeyInCache(logicName, identity, value, seconds) {
    const cacheKey = this.getKey(logicName, identity);
    return super.save(cacheKey, JSON.stringify(value), seconds);
  }

  deleteCustomKeyInCache(prefix, key) {
    const cacheKey = this.getCustomKey(prefix, key);
    return super.delete(cacheKey);
  }
}

module.exports = CacheKeyAccess;

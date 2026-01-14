'use strict';
const Redis = require('ioredis');
const {log: logUtil} = require('../common/utils/index.js');

/** 
 *  keyConfig:
 *    Key Configuration - defines custom key generation.
      used to support compatibility between original and new redis key generation.

      use action function to generate key, ie: keysCache.getKey || keysCache.getOriginalKey
      use other object properties in keyConfig to return a response from the key generation action.
    {
      action: function
      ...otherProperties passed to action.
    };
 * 
 */

// reuse cache connection when needed.
let redisCache = null;
class RedisCacheConnector {
  constructor(cacheKey, redisConfig) {
    this.cacheKey = cacheKey;

    logUtil.info('RedisCacheConnector redisCache.status');
    logUtil.info(redisCache);
    if (redisCache) {
      logUtil.info('RedisCacheConnector redisCache.status');
      logUtil.info(redisCache.status);
      if (
        redisCache.status === 'connect' ||
        redisCache.status === 'ready' ||
        redisCache.status === 'connecting'
      ) {
        logUtil.info('RedisCacheConnector - reuse cache connection');
        this.redis = redisCache;
      } else {
        logUtil.info('RedisCacheConnector - disconnect connection');
        try {
          redisCache.quit();
        } catch (err) {
          logUtil.info('RedisCacheConnector - redisCache quit error');
          logUtil.info(err && err.message ? err.message : err);
        }
        redisCache = new Redis(redisConfig);
        this.redis = redisCache;
        logUtil.info(
          'RedisCacheConnector - new connection - redisCache.status'
        );
        logUtil.info(this.redis.status);
      }
    } else {
      logUtil.info('RedisCacheConnector - create new connection');
      redisCache = new Redis(redisConfig);
      this.redis = redisCache;
      logUtil.info('RedisCacheConnector - new connection - redisCache.status');
      logUtil.info(this.redis.status);
    }
  }

  async save(keyOrConfig, value, time) {
    const key =
      typeof keyOrConfig === 'string'
        ? keyOrConfig
        : await this.cacheKey.get(keyOrConfig);
    // set key / value in redis.
    return await this.redis.set(key, value, 'EX', time);
  }

  async delete(keyOrConfig) {
    const key =
      typeof keyOrConfig === 'string'
        ? keyOrConfig
        : await this.cacheKey.get(keyOrConfig);
    // delete redis key / value
    return await this.redis.del(key);
  }

  async get(keyOrConfig) {
    const key =
      typeof keyOrConfig === 'string'
        ? keyOrConfig
        : await this.cacheKey.get(keyOrConfig);

    return new Promise((resolve, reject) => {
      logUtil.info('key used to call get redis: ');
      logUtil.info(key);
      logUtil.info(this.redis.get(key));

      this.redis
        .get(key)
        .then((value) => {
          resolve(value);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  disconnect() {
    this.redis.quit();
  }
}

module.exports = RedisCacheConnector;

'use strict';

const {log: logUtil} = require('../util/index.js');

const ICache = {
  // eslint-disable-next-line no-unused-vars
  save: function (key, value, time) {},
  // eslint-disable-next-line no-unused-vars
  get: function (key) {},
  // eslint-disable-next-line no-unused-vars
  delete: function (key) {},
  disconnect: function () {}
};

class RedisCache {
  constructor(redis) {
    this.redis = redis;
  }
  save(key, value, time) {
    return this.redis.set(key, value, 'EX', time);
  }

  delete(key) {
    return this.redis.del(key);
  }

  get(key) {
    logUtil.info('key used to call get redis: ');
    logUtil.info(key);

    return new Promise((resolve, reject) => {
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

module.exports = {
  ICache,
  RedisCache
};

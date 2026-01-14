'use strict';

const ICache = {
  // eslint-disable-next-line no-unused-vars
  save: function (key, value, time) {},
  // eslint-disable-next-line no-unused-vars
  get: function (key) {},
  disconnect: function () {}
};

const RedisCache = function (redis) {
  this.redis = redis;
};

RedisCache.prototype = Object.create(ICache);

RedisCache.prototype.save = function (key, value, time) {
  return this.redis.set(key, value, 'EX', time);
};

RedisCache.prototype.get = function (key) {
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
};

RedisCache.prototype.disconnect = function () {
  this.redis.disconnect();
};

module.exports = {
  ICache,
  RedisCache
};

'use strict';

const ICache = {
  save: function () {},
  get: function () {},
  disconnect: function () {}
};

const RedisCache = function (redis) {
  this.redis = redis;
};

RedisCache.prototype = Object.create(ICache);

RedisCache.prototype.save = function (_key, _value, _time) {
  return this.redis.set(_key, _value, 'EX', _time);
};

RedisCache.prototype.get = function (_key) {
  return new Promise((resolve, reject) => {
    this.redis
      .get(_key)
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

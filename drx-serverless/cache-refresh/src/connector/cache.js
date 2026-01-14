'use strict';

const ICache = {
  // eslint-disable-next-line no-unused-vars
  save: function (key, value, time) {},
  // eslint-disable-next-line no-unused-vars
  scanKeys: function (match, count) {},
  // eslint-disable-next-line no-unused-vars
  delete: function (key) {},
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

RedisCache.prototype.scanKeys = function (match, count) {
  return new Promise((resolve, reject) => {
    const foundKeys = [];

    const stream = this.redis.scanStream({
      match,
      count
    });

    stream.on('data', (keys) => {
      if (Array.isArray(keys) && keys.length) {
        foundKeys.push(...keys);
      }
    });

    stream.on('error', function (error) {
      reject(error);
    });

    stream.on('end', function () {
      resolve(foundKeys);
    });
  });
};

RedisCache.prototype.delete = function (keys = []) {
  const pipeline = this.redis.pipeline();
  keys.forEach(function (key) {
    pipeline.del(key);
  });

  return pipeline.exec();
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

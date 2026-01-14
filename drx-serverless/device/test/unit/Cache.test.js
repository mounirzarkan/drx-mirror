'use strict';

const Redis = require('ioredis');
const {expect} = require('chai');
const sinon = require('sinon');
const {RedisCache} = require('../../src/connector/index.js');

let RedisStub;
afterEach(() => {
  // Restore the default sandbox here
  sinon.restore();
});

async function test(Cache) {
  const key = 'testKey12345';
  const value = 'testValue12345';
  const time = 2;
  await Cache.save(key, value, time);
  const result = await Cache.get(key).catch(console.error);
  expect(result).to.eql(value);
}

describe('test cache.js', () => {
  describe('success scenario', () => {
    beforeEach(() => {
      RedisStub = sinon.createStubInstance(Redis);
      RedisStub.set.returns(Promise.resolve('OK'));
      RedisStub.get.returns(Promise.resolve('testValue12345'));
    });

    it('should return same value', (done) => {
      const redisCache = new RedisCache(RedisStub);
      test(redisCache);
      done();
    });
  });
  describe('error scenario', () => {
    beforeEach(() => {
      RedisStub = sinon.createStubInstance(Redis);
      RedisStub.get.returns(Promise.reject('dummy error'));
    });
    it('should catch reject', (done) => {
      const redisCache = new RedisCache(RedisStub);
      redisCache
        .get('key')
        .catch((value) => expect(value).to.eql('dummy error'));
      done();
    });
  });
});

'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const {RedisCache} = require('../../../src/connector/cache.js');

describe('SUITE: RedisCache', () => {
  describe('RedisCache.delete', () => {
    let redisCache, fakeDel, fakeExec, execResponse, fakePipeline;
    beforeEach(() => {
      execResponse = JSON.stringify([
        [null, 1],
        [null, 1]
      ]);

      fakeDel = sinon.fake.returns(undefined);
      fakeExec = sinon.fake.resolves(JSON.parse(execResponse));

      fakePipeline = sinon.fake.returns({del: fakeDel, exec: fakeExec});

      const redis = {pipeline: fakePipeline};
      redisCache = new RedisCache(redis);
    });

    it("CASE : delete(['key1','key2']) expects cache.del to be called with 'key1'", async () => {
      await redisCache.delete(['key1', 'key2']);

      expect(fakeDel.getCall(0).args[0]).to.equal('key1');
    });

    it("CASE : delete(['key1','key2']) expects cache.del to be called with 'key2'", async () => {
      await redisCache.delete(['key1', 'key2']);

      expect(fakeDel.getCall(1).args[0]).to.equal('key2');
    });

    it("CASE : delete(['key1','key2']) expects [[null, 1],[null, 1]] response.", async () => {
      const execTestResponse = JSON.parse(execResponse);

      const response = await redisCache.delete(['key1', 'key2']);

      expect(response).to.deep.equal(execTestResponse);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});

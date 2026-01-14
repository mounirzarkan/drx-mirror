'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const CacheRefreshService = require('../../../src/service/cacheRefreshService.js');
const {RedisCache} = require('../../../src/connector/cache.js');
const log = require('../../../src/util/logUtil.js');
const _ = require('lodash');

describe('SUITE: CacheRefreshService', () => {
  let cacheRefreshService, cache;
  beforeEach(() => {
    cache = new RedisCache({});
    const config = {env: 'DEV', cache};
    cacheRefreshService = new CacheRefreshService(config);
    sinon.stub(log, 'debug').returns(undefined);
  });

  it("CASE: deleteCache('appName') returns [[null, 1], [null, 1]]", async () => {
    sinon
      .stub(cacheRefreshService.cacheKeyService, 'getWildcardPattern')
      .resolves('DEV_appName_*');
    sinon.stub(cache, 'scanKeys').resolves(['key1', 'key2', 'key1']);
    sinon.stub(_, 'uniq').returns(['key1', 'key2']);
    sinon.stub(cache, 'delete').resolves([
      [null, 1],
      [null, 1]
    ]);

    const result = await cacheRefreshService.deleteCache('appName');

    expect(result).to.deep.equal([
      [null, 1],
      [null, 1]
    ]);
  });

  it("CASE: deleteCache('appName','logicName') returns [[null, 1], [null, 1]]", async () => {
    sinon
      .stub(cacheRefreshService.cacheKeyService, 'getWildcardPattern')
      .resolves('DEV_appName_logicName_*');
    sinon.stub(cache, 'scanKeys').resolves(['key1', 'key2', 'key1']);
    sinon.stub(_, 'uniq').returns(['key1', 'key2']);
    sinon.stub(cache, 'delete').resolves([
      [null, 1],
      [null, 1]
    ]);

    const result = await cacheRefreshService.deleteCache(
      'appName',
      'logicName'
    );

    expect(result).to.deep.equal([
      [null, 1],
      [null, 1]
    ]);
  });

  afterEach(() => {
    sinon.restore();
  });
});

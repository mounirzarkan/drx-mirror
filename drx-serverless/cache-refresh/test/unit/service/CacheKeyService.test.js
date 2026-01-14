'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const CacheKeyService = require('../../../src/service/cacheKeyService.js');

describe('SUITE: CacheKeyService', () => {
  let cacheKeyService;
  beforeEach(() => {
    const config = {env: 'DEV'};
    cacheKeyService = new CacheKeyService(config);
  });

  it("CASE: getOriginalWildcardPattern('drx','cacheUserInfo',undefined) returns 'drx-dev-cacheUserInfo-*' ", () => {
    const result = cacheKeyService.getOriginalWildcardPattern(
      'drx',
      'cacheUserInfo',
      undefined
    );
    expect(result).to.equal('drx-dev-cacheUserInfo-*');
  });

  it("CASE: getOriginalWildcardPattern('drx','cacheUserInfo','249218823100261') returns 'drx-dev-cacheUserInfo-249218823100261-*' ", () => {
    const result = cacheKeyService.getOriginalWildcardPattern(
      'drx',
      'cacheUserInfo',
      '249218823100261'
    );
    expect(result).to.equal('drx-dev-cacheUserInfo-249218823100261-*');
  });

  it("CASE: getWildcardPattern('appName',undefined) returns 'dev_drx-appName_*' ", () => {
    const result = cacheKeyService.getWildcardPattern(
      'drx',
      'appName',
      undefined
    );
    expect(result).to.equal('dev_drx-appName_*');
  });

  it("CASE: getWildcardPattern('appName',null) returns 'dev_drx-appName_*' ", () => {
    const result = cacheKeyService.getWildcardPattern('drx', 'appName', null);
    expect(result).to.equal('dev_drx-appName_*');
  });

  it("CASE: getWildcardPattern('appName','logicName') returns 'dev_drx-appName_logicName_*' ", () => {
    const result = cacheKeyService.getWildcardPattern(
      'drx',
      'appName',
      'logicName'
    );
    expect(result).to.equal('dev_drx-appName_logicName_*');
  });

  afterEach(() => {
    sinon.restore();
  });
});

const {expect} = require('chai');
const sinon = require('sinon');
const TestRunService = require('../../../src/service/testRunService.js');

describe('SUIT: TestRunService', () => {
  it('CASE: postSaveCache returns {prevValue,saveTimeStr,beforeDeleteCache,appName}', async () => {
    const cache = {get: sinon.stub(), save: sinon.stub()};
    const saveDateNow = '1618793585966';
    sinon.stub(Date, 'now').returns(Number.parseInt(1618793585966));

    cache.get.onCall(0).returns(undefined);
    cache.save.onCall(0).returns(saveDateNow);
    cache.get.onCall(1).returns(saveDateNow);

    const config = {env: 'dev', cache};
    const testRunService = new TestRunService(config);

    sinon
      .stub(testRunService.cacheKeyService, 'getKey')
      .returns('testCacheKeyString');

    const result = await testRunService.postSaveCache('logicName', 'identity');

    expect(result).not.undefined;
    expect(cache.get.getCall(0)).not.undefined;
    expect(cache.get.getCall(0).args).is.a('array');
    expect(cache.get.getCall(0).args[0]).to.equal('testCacheKeyString');

    expect(cache.get.getCall(1)).not.undefined;
    expect(cache.get.getCall(1).args).is.a('array');
    expect(cache.get.getCall(1).args[0]).to.equal('testCacheKeyString');

    expect(cache.save.getCall(0)).not.undefined;
    expect(cache.save.getCall(0).args).is.a('array');
    expect(cache.save.getCall(0).args[0]).to.equal('testCacheKeyString');
    expect(cache.save.getCall(0).args[1]).to.equal(saveDateNow);

    expect(result.prevValue, 'result.prevValue').to.equal('none');
    expect(result.saveTimeStr, 'result.saveTimeStr').to.equal(saveDateNow);
    expect(result.beforeDeleteCache, 'result.beforeDeleteCache').to.equal(
      saveDateNow
    );
    expect(result.appName, 'result.appName').to.equal('cacheRefresh');
  });

  it('CASE: postSaveCache returns {prevValue,saveTimeStr,beforeDeleteCache,appName}', async () => {
    const cache = {get: sinon.stub()};
    cache.get.onCall(0).returns(undefined);

    const config = {env: 'dev', cache};
    const testRunService = new TestRunService(config);

    sinon
      .stub(testRunService.cacheKeyService, 'getKey')
      .returns('testCacheKeyString');

    const result = await testRunService.getCacheValue('logicName', 'identity');

    expect(cache.get.getCall(0)).not.undefined;
    expect(cache.get.getCall(0).args).is.a('array');
    expect(cache.get.getCall(0).args[0]).to.equal('testCacheKeyString');
    expect(result).to.equal(undefined);
  });

  afterEach(() => {
    sinon.restore();
  });
});

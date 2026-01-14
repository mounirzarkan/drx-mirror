'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const ContentService = require('../../src/service/contentService.js');
const jsforce = require('jsforce');

describe('SUITE: ContentService.', () => {
  const configStr = JSON.stringify({
    sf_hostname: 'sf_hostname',
    sf_clientId: 'sf_clientId',
    sf_userName: 'sf_userName',
    sf_secret: {
      clientSecret: 'clientSecret',
      password: 'password',
      secret: 'secret'
    },
    userSessionPrefix: 'drx-dev-',
    userSessionSeconds: 7200,
    cacheRepo: undefined
  });

  describe('getHeaderList', () => {
    let contentService, cacheGet, cacheSave;

    beforeEach(async function () {
      const fakeLogin = sinon.fake(async function () {
        this.instanceUrl = 'instanceUrl';
        this.accessToken = 'accessToken';
      });
      sinon.stub(jsforce, 'Connection').returns({login: fakeLogin});
      const config = JSON.parse(configStr);
      contentService = new ContentService(config);

      sinon
        .stub(contentService.cacheKeyService, 'getUserInfoKey')
        .returns('userSessionPrefixcacheUserInfo-cochlear_id');

      cacheGet = sinon.fake.resolves(undefined);
      cacheSave = sinon.fake.resolves(undefined);
      contentService.cacheRepo = {get: cacheGet, save: cacheSave};
    });

    it('CASE: getHeaderList fetches headerlist.', async () => {
      const authorizer = {
        firstName: 'Kevin',
        lastName: 'Lee',
        email: 'Kevin.Lee@cochlear.com'
      };
      const headerList = contentService.getHeaderList(authorizer);

      expect(headerList).to.eql({
        initial: 'KL',
        email: 'Kevin.Lee@cochlear.com'
      });
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('getUHmenu', () => {
    let contentService, cacheGet, cacheSave;

    const cachedHeaderListStr = JSON.stringify({
      initial: 'VR',
      email: 'VincentRobisonUS@SIT.com'
    });
    const uhMenuConfigUSRespStr = JSON.stringify(
      require('../mock/uhMenuConfigUSResponse.json')
    );
    const transformedUHmenuConfigUSRespStr = JSON.stringify(
      require('../mock/transformedUHmenuConfigUSResponse.json')
    );

    beforeEach(async function () {
      const fakeLogin = sinon.fake(async function () {
        this.instanceUrl = 'instanceUrl';
        this.accessToken = 'accessToken';
      });
      sinon.stub(jsforce, 'Connection').returns({login: fakeLogin});
      const config = JSON.parse(configStr);
      contentService = new ContentService(config);
      sinon
        .stub(contentService.scConnector, 'getUHmenu')
        .withArgs('us')
        .resolves(JSON.parse(uhMenuConfigUSRespStr))
        .withArgs('undefinedCountry')
        .resolves(undefined);

      cacheGet = sinon.fake.resolves(undefined);
      cacheSave = sinon.fake.resolves(undefined);
      contentService.cacheRepo = {get: cacheGet, save: cacheSave};
    });

    it('CASE: getUHmenu returns a US headerList', async () => {
      const transformedUHmenuConfigUSResp = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      const headerlistSample = JSON.parse(cachedHeaderListStr);
      const headerlistUSExpectedResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };

      sinon
        .stub(contentService.cacheKeyService, 'getUHmenuConfigkey')
        .withArgs('us')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_us');
      sinon.stub(contentService, 'getResponseFromCache').resolves(undefined);

      sinon
        .stub(contentService, 'transformResponse')
        .returns(transformedUHmenuConfigUSResp);
      sinon
        .stub(contentService, 'saveToCache')
        .resolves(transformedUHmenuConfigUSRespStr);

      const headerList = await contentService.getUHmenu(headerlistSample, 'us');

      expect(
        contentService.scConnector.getUHmenu.callCount,
        'contentService.scConnector.getUHmenu.callCount'
      ).to.equal(1);
      expect(
        contentService.transformResponse.callCount,
        'contentService.transformResponse.callCount'
      ).to.equal(1);
      expect(headerList).to.deep.equals(headerlistUSExpectedResp);
    });

    it('CASE: getUHmenu without cached result to save headerlist to cache', async () => {
      const transformedUHmenuConfigUSResp = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      const headerlistSample = JSON.parse(cachedHeaderListStr);
      const successTransformedUHmenu = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      sinon
        .stub(contentService.cacheKeyService, 'getUHmenuConfigkey')
        .withArgs('us')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_us');
      sinon.stub(contentService, 'getResponseFromCache').resolves(undefined);
      sinon
        .stub(contentService, 'transformResponse')
        .returns(transformedUHmenuConfigUSResp);
      sinon
        .stub(contentService, 'saveToCache')
        .resolves(transformedUHmenuConfigUSRespStr);

      await contentService.getUHmenu(headerlistSample, 'us');

      expect(
        contentService.saveToCache.callCount,
        'contentService.saveToCache.callCount'
      ).to.equal(1);
      expect(contentService.saveToCache.getCall(0)).not.undefined;
      expect(contentService.saveToCache.getCall(0).args[0]).to.be.a('string');
      expect(contentService.saveToCache.getCall(0).args[0]).to.equal(
        'dev_drx-cacheUserInfo_uhmenu-configuration_us'
      );
      expect(contentService.saveToCache.getCall(0).args[1]).to.deep.equal(
        successTransformedUHmenu
      );
    });

    it('CASE: getUHmenu with an unknown countryCode, calls itself again with DEFAULT_COUNTRY_CODE argument.', async () => {
      const transformedUHmenuConfigUSResp = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      const headerlistSample = JSON.parse(cachedHeaderListStr);

      sinon
        .stub(contentService.cacheKeyService, 'getUHmenuConfigkey')
        .withArgs('us')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_us')
        .withArgs('undefinedCountry')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_undefinedcountry');
      sinon
        .stub(contentService, 'getResponseFromCache')
        .withArgs('dev_drx-cacheUserInfo_uhmenu-configuration_us')
        .resolves(transformedUHmenuConfigUSResp)
        .withArgs('dev_drx-cacheUserInfo_uhmenu-configuration_us')
        .resolves(undefined);
      sinon
        .stub(contentService, 'transformResponse')
        .returns(transformedUHmenuConfigUSResp);
      sinon
        .stub(contentService, 'saveToCache')
        .resolves(transformedUHmenuConfigUSRespStr);

      sinon.spy(contentService, 'getUHmenu');

      await contentService.getUHmenu(headerlistSample, 'undefinedCountry');

      expect(
        contentService.getUHmenu.callCount,
        'contentService.getUHmenu.callCount'
      ).to.equal(2);
      expect(contentService.getUHmenu.getCall(0)).not.undefined;
      expect(contentService.getUHmenu.getCall(0).args).not.undefined;
      expect(contentService.getUHmenu.getCall(0).args[1]).to.equal(
        'undefinedCountry'
      );

      expect(contentService.getUHmenu.getCall(1)).not.undefined;
      expect(contentService.getUHmenu.getCall(1).args).not.undefined;
      expect(contentService.getUHmenu.getCall(1).args[1]).to.equal('us');
    });

    it('CASE: getUHmenu with an unknown countryCode, returns us headerList', async () => {
      const transformedUHmenuConfigUSResp = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      const headerlistSample = JSON.parse(cachedHeaderListStr);

      const headerlistUSExpectedResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };

      sinon
        .stub(contentService.cacheKeyService, 'getUHmenuConfigkey')
        .withArgs('us')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_us')
        .withArgs('undefinedCountry')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_undefinedcountry');
      sinon
        .stub(contentService, 'getResponseFromCache')
        .withArgs('dev_drx-cacheUserInfo_uhmenu-configuration_us')
        .resolves(transformedUHmenuConfigUSResp)
        .withArgs('dev_drx-cacheUserInfo_uhmenu-configuration_us')
        .resolves(undefined);
      sinon
        .stub(contentService, 'transformResponse')
        .returns(transformedUHmenuConfigUSResp);
      sinon
        .stub(contentService, 'saveToCache')
        .resolves(transformedUHmenuConfigUSRespStr);

      sinon.spy(contentService, 'getUHmenu');

      const response = await contentService.getUHmenu(
        headerlistSample,
        'undefinedCountry'
      );
      expect(response).to.deep.equal(headerlistUSExpectedResp);
    });

    it('CASE: getUHmenu returns cached headerlist', async () => {
      const transformedUHmenuConfigUSResp = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      const headerlistSample = JSON.parse(cachedHeaderListStr);
      const headerlistUSExpectedResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };

      sinon
        .stub(contentService.cacheKeyService, 'getUHmenuConfigkey')
        .withArgs('us')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_us');
      sinon
        .stub(contentService, 'getResponseFromCache')
        .resolves(transformedUHmenuConfigUSResp);

      sinon
        .stub(contentService, 'transformResponse')
        .returns(transformedUHmenuConfigUSResp);
      sinon
        .stub(contentService, 'saveToCache')
        .resolves(transformedUHmenuConfigUSRespStr);

      const headerList = await contentService.getUHmenu(headerlistSample, 'us');

      expect(headerList).to.deep.equal(headerlistUSExpectedResp);
    });

    it('CASE: getUHmenu expects cache methods to be invoked when returning cached headerlist', async () => {
      const transformedUHmenuConfigUSResp = JSON.parse(
        transformedUHmenuConfigUSRespStr
      );

      const headerlistSample = JSON.parse(cachedHeaderListStr);

      sinon
        .stub(contentService.cacheKeyService, 'getUHmenuConfigkey')
        .withArgs('us')
        .returns('dev_drx-cacheUserInfo_uhmenu-configuration_us');
      sinon
        .stub(contentService, 'getResponseFromCache')
        .resolves(transformedUHmenuConfigUSResp);

      sinon
        .stub(contentService, 'transformResponse')
        .returns(transformedUHmenuConfigUSResp);
      sinon
        .stub(contentService, 'saveToCache')
        .resolves(transformedUHmenuConfigUSRespStr);

      await contentService.getUHmenu(headerlistSample, 'us');

      expect(
        contentService.cacheKeyService.getUHmenuConfigkey.callCount,
        'contentService.cacheKeyService.getUHmenuConfigkey'
      ).to.equal(1);
      expect(
        contentService.getResponseFromCache.callCount,
        'contentService.getResponseFromCache'
      ).to.equal(1);
      expect(contentService.getResponseFromCache.getCall(0)).not.undefined;
      expect(contentService.getResponseFromCache.getCall(0).args[0]).to.be.a(
        'string'
      );
      expect(contentService.getResponseFromCache.getCall(0).args[0]).to.equal(
        'dev_drx-cacheUserInfo_uhmenu-configuration_us'
      );

      expect(
        contentService.scConnector.getUHmenu.callCount,
        'contentService.scConnector.getUHmenu.callCount'
      ).to.equal(0);
      expect(
        contentService.transformResponse.callCount,
        'contentService.transformResponse.callCount'
      ).to.equal(0);
      expect(
        contentService.saveToCache.callCount,
        'contentService.saveToCache.callCount'
      ).to.equal(0);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('getHeader', () => {
    let contentService, cacheGet, cacheSave;

    const cachedHeaderListStr = JSON.stringify({
      initial: 'VR',
      email: 'VincentRobisonUS@SIT.com'
    });
    const transformedUHmenuConfigUSRespStr = JSON.stringify(
      require('../mock/transformedUHmenuConfigUSResponse.json')
    );

    beforeEach(async function () {
      const fakeLogin = sinon.fake(async function () {
        this.instanceUrl = 'instanceUrl';
        this.accessToken = 'accessToken';
      });
      sinon.stub(jsforce, 'Connection').returns({login: fakeLogin});
      const config = JSON.parse(configStr);
      contentService = new ContentService(config);

      sinon
        .stub(contentService.cacheKeyService, 'getUserInfoKey')
        .returns('userSessionPrefixcacheUserInfo-cochlear_id');

      cacheGet = sinon.fake.resolves(undefined);
      cacheSave = sinon.fake.resolves(undefined);
      contentService.cacheRepo = {get: cacheGet, save: cacheSave};
    });

    it('CASE: getHeader without cached value returns headerList', async () => {
      const headerlistSample = JSON.parse(cachedHeaderListStr);
      const getUHmenuUSResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };
      const headerlistUSExpectedResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };

      sinon.stub(contentService, 'getHeaderList').resolves(headerlistSample);
      sinon.stub(contentService, 'getUHmenu').resolves(getUHmenuUSResp);
      const headerList = await contentService.getHeader(
        'cochlear_id',
        'US',
        'en'
      );

      expect(
        contentService.cacheKeyService.getUserInfoKey.callCount,
        'contentService.cacheKeyService.getUserInfoKey.callCount'
      ).to.equal(1);
      expect(
        contentService.cacheRepo.get.callCount,
        'contentService.cacheRepo.save.callCount'
      ).to.equal(1);
      expect(
        contentService.getHeaderList.callCount,
        'contentService.getHeaderList.callCount'
      ).to.equal(1);
      expect(
        contentService.cacheRepo.save.callCount,
        'contentService.cacheRepo.save.callCount'
      ).to.equal(1);
      expect(
        contentService.getUHmenu.callCount,
        'contentService.getUHmenu.callCount'
      ).to.equal(1);
      expect(headerList).to.deep.equals(headerlistUSExpectedResp);
    });

    it('CASE: getHeader with cached value returns headerList', async () => {
      const headerlistSample = JSON.parse(cachedHeaderListStr);
      const getUHmenuUSResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };
      const headerlistUSExpectedResp = {
        ...headerlistSample,
        ...JSON.parse(transformedUHmenuConfigUSRespStr)
      };

      sinon.stub(contentService, 'getHeaderList').resolves(headerlistSample);
      sinon.stub(contentService, 'getUHmenu').resolves(getUHmenuUSResp);

      contentService.cacheRepo.get = sinon.fake.resolves(
        JSON.stringify(headerlistSample)
      );

      const headerList = await contentService.getHeader(
        'cochlear_id',
        'US',
        'en'
      );

      expect(
        contentService.cacheKeyService.getUserInfoKey.callCount,
        'contentService.cacheKeyService.getUserInfoKey.callCount'
      ).to.equal(1);
      expect(
        contentService.cacheRepo.get.callCount,
        'contentService.cacheRepo.save.callCount'
      ).to.equal(1);
      expect(
        contentService.getHeaderList.callCount,
        'contentService.getHeaderList.callCount'
      ).to.equal(0);
      expect(
        contentService.cacheRepo.save.callCount,
        'contentService.cacheRepo.save.callCount'
      ).to.equal(0);
      expect(
        contentService.getUHmenu.callCount,
        'contentService.getUHmenu.callCount'
      ).to.equal(1);
      expect(headerList).to.deep.equals(headerlistUSExpectedResp);
    });

    afterEach(async function () {
      sinon.restore();
    });
  });

  describe('getResponseFromCache', () => {
    let contentService, cacheGet, cacheSave;

    const transformedUHmenuConfigUSRespStr = JSON.stringify(
      require('../mock/transformedUHmenuConfigUSResponse.json')
    );

    beforeEach(async function () {
      const fakeLogin = sinon.fake(async function () {
        this.instanceUrl = 'instanceUrl';
        this.accessToken = 'accessToken';
      });
      sinon.stub(jsforce, 'Connection').returns({login: fakeLogin});
      const config = JSON.parse(configStr);
      contentService = new ContentService(config);

      cacheGet = sinon.fake.resolves(undefined);
      cacheSave = sinon.fake.resolves(undefined);
      contentService.cacheRepo = {get: cacheGet, save: cacheSave};
    });

    it('CASE: getResponseFromCache return cached response', async () => {
      const expectedResp = JSON.parse(transformedUHmenuConfigUSRespStr);
      const menuKey = 'dev_drx-cacheUserInfo_uhmenu-configuration_us';

      cacheGet = sinon.fake.resolves(transformedUHmenuConfigUSRespStr);
      contentService.cacheRepo.get = cacheGet;

      const resp = await contentService.getResponseFromCache(menuKey);

      expect(contentService.cacheRepo.get.callCount).to.equal(1);
      expect(resp).to.deep.equal(expectedResp);
    });

    afterEach(() => {
      sinon.restore();
    });
  });
});

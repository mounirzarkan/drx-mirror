const sinon = require('sinon');
const {expect} = require('chai');

const {
  EnvironmentConfiguration
} = require('../../../src/configuration/index.js');
const connectors = require('../../../src/connector/index.js');
const {RegionController} = require('../../../src/controller/index.js');

describe('SUITE: RegionController', () => {
  let configuration, regionController;

  const envStr = JSON.stringify({
    region: 'region',
    SMSFIntegration: 'SMSFIntegration',
    environment: 'environment',
    SCEndpoint: 'SCEndpoint',
    SFHostname: 'SFHostname',
    SFClientID: 'SFClientID',
    SFUsername: 'SFUsername',
    redisTokenKey: 'redisTokenKey',
    userSessionPrefix: 'userSessionPrefix',
    RedisPort: 'RedisPort',
    RedisHostname: 'RedisHostname',
    geoNames: {},
    cacheSeconds: 300,
    prefixName: 'drx',
    appName: 'region',
    subSeparator: '-',
    separator: '_',
    secretCacheSeconds: 300
  });
  const secretStr = JSON.stringify({
    secret: 'secret',
    clientSecret: 'clientSecret',
    password: 'password',
    redisToken: 'redisToken',
    auth_clientSecret: 'auth_clientSecret',
    encryptKey: 'encryptKey',
    signKey: 'signKey',
    permissions: 'permissions',
    sc_apikey: 'sc_apikey',
    geonames_username: 'mzarkan',
    geonames_levels: JSON.stringify({
      US: '2',
      CA: '2',
      GB: '3',
      IE: '3',
      NZ: '2',
      AU: '2',
      BE: '3'
    })
  });
  beforeEach(async () => {
    const env = JSON.parse(envStr);
    configuration = new EnvironmentConfiguration(env);
    const cacheObj = {get: function () {}, save: function () {}};
    sinon.stub(connectors.awsConnector, 'getSecret').resolves(secretStr);
    sinon.stub(configuration, 'initiateCache').returns(cacheObj);
    await configuration.init();
    regionController = new RegionController(configuration);
  });

  it('CASE: regionController.retrieveCountryData retrieves data with regions array greater then 0', async () => {
    sinon
      .stub(regionController.aggregationCache.cache, 'get')
      .resolves(undefined);
    sinon
      .stub(regionController.aggregationCache.cache, 'save')
      .resolves(undefined);
    const data = await regionController.retrieveCountryData('US', 'EN');
    expect(data)
      .with.property('regions')
      .with.property('length')
      .to.be.greaterThan(0);
  });

  afterEach(() => {
    sinon.restore();
  });
});

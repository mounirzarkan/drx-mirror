const sinon = require('sinon');
const {expect} = require('chai');

const {
  EnvironmentConfiguration
} = require('../../../src/configuration/index.js');
const {awsConnector} = require('../../../src/connector/index.js');

describe('SUITE: EnvironmentConfiguration', () => {
  let configuration = undefined;

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

  const configurationStr = JSON.stringify({
    region: 'region',
    secretName: 'SMSFIntegration',
    env: 'environment',
    scEndpoint: 'SCEndpoint',
    sfHostname: 'SFHostname',
    sfClientId: 'SFClientID',
    sfUserName: 'SFUsername',
    redisTokenKey: 'redisTokenKey',
    userSessionPrefix: 'userSessionPrefix',
    redisHost: 'RedisHostname',
    redisPort: 'RedisPort',
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
    geonames_username: 'geonames_username',
    geonames_levels: '["geonames_levels"]'
  });
  beforeEach(() => {
    const env = JSON.parse(envStr);
    configuration = new EnvironmentConfiguration(env);
  });

  it('CASE: configuration instance has matching properties to JSON.parse(configurationStr)', async () => {
    const configurationObj = JSON.parse(JSON.stringify(configuration));
    expect(configurationObj).to.deep.equal(JSON.parse(configurationStr));
  });

  it('CASE: init assigns values to secretStr, secret, encryptKey, cacheRepo properties.', async () => {
    const cacheObj = {get: function () {}, set: function () {}};
    sinon.stub(awsConnector, 'getSecret').resolves(secretStr);
    sinon.stub(configuration, 'initiateCache').returns(cacheObj);
    await configuration.init();

    expect(configuration)
      .with.property('secret')
      .to.deep.equal(JSON.parse(secretStr));
    expect(configuration).with.property('encryptKey').to.equal('encryptKey');
    expect(configuration).with.property('cacheRepo').to.equal(cacheObj);
  });

  afterEach(() => {
    sinon.restore();
  });
});

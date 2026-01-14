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
    Environment: 'Environment',
    SCEndpoint: 'SCEndpoint',
    SFHostname: 'SFHostname',
    SFClientID: 'SFClientID',
    SFUsername: 'SFUsername',
    redisTokenKey: 'redisTokenKey',
    userSessionPrefix: 'userSessionPrefix',
    tokenSessionSeconds: 12345,
    userSessionSeconds: 12345,
    RedisPort: 'RedisPort',
    RedisHostname: 'RedisHostname',
    privacyRulesSeconds: 12345
  });

  const configurationStr = JSON.stringify({
    env: 'Environment',
    geoNames: {},
    privacyRulesSeconds: 12345,
    redisHost: 'RedisHostname',
    redisPort: 'RedisPort',
    redisTokenKey: 'redisTokenKey',
    redis_host: 'RedisHostname',
    redis_port: 'RedisPort',
    region: 'region',
    scEndpoint: 'SCEndpoint',
    sc_endpoint: 'SCEndpoint',
    secretName: 'SMSFIntegration',
    sfClientId: 'SFClientID',
    sfHostname: 'SFHostname',
    sfUserName: 'SFUsername',
    tokenSessionSeconds: 12345,
    userSessionPrefix: 'userSessionPrefix',
    userSessionSeconds: 12345
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
    geonames_levels: '{}'
  });
  beforeEach(() => {
    const env = JSON.parse(envStr);
    configuration = new EnvironmentConfiguration(env);
  });

  it('CASE: configuration instance has matching properties to JSON.parse(configurationStr)', async () => {
    const configurationObj = JSON.parse(JSON.stringify(configuration));
    expect(configurationObj).to.deep.equal(JSON.parse(configurationStr));
  });

  it('CASE: init assigns values to awsSecretStr ,secret ,encryptKey ,cache properties.', async () => {
    const cacheObj = {get: function () {}, set: function () {}};
    sinon.stub(awsConnector, 'getSecret').resolves(secretStr);
    sinon.stub(configuration, 'initiateCache').returns(cacheObj);
    await configuration.init();

    expect(configuration).with.property('awsSecretStr').to.equal(secretStr);
    expect(configuration)
      .with.property('secret')
      .to.deep.equal(JSON.parse(secretStr));
    expect(configuration).with.property('encryptKey').to.equal('encryptKey');
    expect(configuration).with.property('cache').to.equal(cacheObj);
  });

  afterEach(() => {
    sinon.restore();
  });
});

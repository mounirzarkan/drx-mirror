const {AWSConnector} = require('../connector/index.js');
const Redis = require('ioredis');
const CacheKeyAccess = require('../connector/cacheKeyAccess.js');

const log = require('../util/logUtil.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.Environment;
    this.region = env.region;
    this.secretName = env.secretName;
    this.pmEndpoint = env.PMEndpoint;
    this.boomiTokenEndpoint = env.boomiTokenEndpoint;
    this.boomiServiceEndpoint = env.boomiServiceEndpoint;
    this.sfHostname = env.SFHostname;
    this.sfClientId = env.SFClientID;
    this.sfUserName = env.SFUsername;
    this.redisPort = env.RedisPort;
    this.redisHost = env.RedisHostname;
    this.redisTokenKey = process.env.redisTokenKey;
    this.userSessionPrefix = process.env.userSessionPrefix;
    this.tokenSessionSeconds = Number.parseInt(env.tokenSessionSeconds, 10);
    this.userSessionSeconds = Number.parseInt(env.userSessionSeconds, 10);
    this.deviceSupportCountries = JSON.parse(env.deviceSupportCountries);
  }

  isTestEnvironment() {
    const envLowerCase = this.env.toLowerCase();
    return (
      envLowerCase === 'dev' || envLowerCase === 'sit' || envLowerCase === 'uat'
    );
  }

  isLocal() {
    return IS_LOCAL;
  }

  initiateCache(redisPort, redisHost, redisPassword) {
    const redis = new Redis({
      port: IS_LOCAL ? 6379 : redisPort,
      host: IS_LOCAL ? 'localhost' : redisHost,
      password: redisPassword,
      tls: IS_LOCAL ? {rejectUnauthorized: false} : {}
    });

    return new CacheKeyAccess(redis, this.env);
  }

  async init() {
    log.debug('before get secret');

    this.awsSecretStr = await AWSConnector.getSecret(
      this.region,
      this.secretName
    );

    log.debug('Configuration before getSecret: ');
    log.debug(this);

    this.secret = JSON.parse(this.awsSecretStr);
    this.permissions = this.secret.permissions;
    this.boomiAuth0ApiKey = this.secret.boomiAuth0ApiKey;
    this.boomiAuth0ClientId = this.secret.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = this.secret.boomiAuth0ClientSecret;
    this.errorUsers =
      this.secret.errorUsers && (JSON.parse(this.secret.errorUsers) || []);

    const redisPassword = this.secret.redisToken;
    const encryptKey = this.secret.encryptKey;

    this.encryptKey = encryptKey;

    this.cache = this.initiateCache(
      this.redisPort,
      this.redisHost,
      redisPassword
    );

    log.debug('finished loadParams: ');
    log.debug(this);
  }
}

module.exports = EnvironmentConfiguration;

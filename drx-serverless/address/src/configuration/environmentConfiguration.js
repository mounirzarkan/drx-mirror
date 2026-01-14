const {awsConnector} = require('../connector/index.js');
const Redis = require('ioredis');
const CacheKeyAccess = require('../connector/cacheKeyAccess.js');

const log = require('../util/logUtil.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.Environment;
    this.region = env.region;
    this.secretName = env.SMSFIntegration;
    this.pmEndpoint = env.PMEndpoint;
    this.boomiOauthEndpoint = env.boomiOauthEndpoint;
    this.boomiServiceEndpoint = env.boomiServiceEndpoint;
    this.sfHostname = env.SFHostname;
    this.sfClientId = env.SFClientID;
    this.sfUserName = env.SFUsername;
    this.scEndpoint = env.SCEndpoint;
    this.redisPort = env.RedisPort;
    this.redisHost = env.RedisHostname;
    this.redisTokenKey = env.redisTokenKey;
    this.userSessionPrefix = env.userSessionPrefix;
    this.tokenSessionSeconds = Number.parseInt(env.tokenSessionSeconds, 10);
    this.userSessionSeconds = Number.parseInt(env.userSessionSeconds, 10);
    this.privacyRulesSeconds = Number.parseInt(env.privacyRulesSeconds, 10);
    this.redis_port = env.RedisPort; // Redis port
    this.redis_host = env.RedisHostname; // Redis host
    this.sc_endpoint = env.SCEndpoint;
    this.geoNames = {};
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

    this.awsSecretStr = await awsConnector.getSecret(
      this.region,
      this.secretName
    );

    log.debug('Configuration before getSecret: ');
    log.debug(this);

    this.secret = JSON.parse(this.awsSecretStr);
    this.boomiAuth0ApiKey = this.secret.boomiAuth0ApiKey;
    this.boomiAuth0ClientId = this.secret.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = this.secret.boomiAuth0ClientSecret;

    this.geoNames = {
      username: this.secret.geonames_username,
      token: this.secret.geonames_token,
      lan: 'en',
      encoding: 'JSON'
    };

    this.geoNamesLevels = JSON.parse(this.secret.geonames_levels);

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

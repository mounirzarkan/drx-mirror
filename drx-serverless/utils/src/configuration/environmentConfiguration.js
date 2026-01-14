const {awsConnector} = require('../connector/index.js');
const Redis = require('ioredis');
const CacheKeyAccess = require('../connector/cacheKeyAccess.js');
const {log} = require('../common/utils/index.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.environment;
    this.region = env.region;
    this.secretName = env.secretName;
    this.redisPort = env.redisPort;
    this.redisHost = env.redisHostname;
    this.redisTokenKey = env.redisTokenKey;
    this.userSessionPrefix = env.userSessionPrefix;
    this.userSessionSeconds = Number.parseInt(env.userSessionSeconds, 10);
    this.tokenSessionSeconds = Number.parseInt(env.tokenSessionSeconds, 10);
    this.dictionarySessionSeconds = Number.parseInt(env.dictionarySessionSeconds, 10);
    this.sfHostname = env.sfHostname;
    this.sfClientId = env.sfClientId;
    this.sfUsername = env.sfUsername;
    this.regionsEndpoint = env.regionsEndpoint;
    this.scEndpoint = env.scEndpoint;
    this.scAuthorEndpoint = env.scAuthorEndpoint;
    this.isScHttpAgent = env.isScHttpAgent;
  }

  isTestEnvironment() {
    const envLowerCase = this.env.toLowerCase();
    return (
      envLowerCase === 'dev' || envLowerCase == 'sit' || envLowerCase === 'uat'
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

    this.secretStr = await awsConnector.getSecret(this.region, this.secretName);

    log.debug('Configuration before getSecret: ');
    log.debug(this);

    this.secret = JSON.parse(this.secretStr);
    this.scApiKey = this.secret.sc_apikey;

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

const {awsConnector} = require('../connector/index.js');
const Redis = require('ioredis');
const CacheKeyAccess = require('../connector/cacheKeyAccess.js');

const log = require('../util/logUtil.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.environment;
    this.region = env.region;
    this.secretName = env.secret;
    this.googleSearchEndpoint = env.googleSearchEndpoint;
    this.sitecoreDamEndpoint = env.sitecoreDamEndpoint;
    this.redisPort = env.redisPort;
    this.redisHost = env.redisHostname;
    this.redisTokenKey = env.redisTokenKey;
    this.userSessionPrefix = env.userSessionPrefix;
    this.userSessionSeconds = Number.parseInt(env.userSessionSeconds, 10);
    this.tokenSessionSeconds = Number.parseInt(env.tokenSessionSeconds, 10);
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

    // eslint-disable-next-line require-atomic-updates
    this.awsSecretStr = await awsConnector.getSecret(
      this.region,
      this.secretName
    );

    log.debug('Configuration before getSecret: ');
    log.debug(this);

    this.secret = JSON.parse(this.awsSecretStr);
    this.googleApiKey = this.secret.googleApiKey;
    this.googleCxId = this.secret.googleCxId;
    this.sitecoreDamApiKey = this.secret.sitecoreDamApiKey;
    this.recaptchaSecretKey = this.secret.recaptchaSecretKey;

    log.debug('Configuration after getSecret: ');
    log.debug(this.secret);

    const redisPassword = this.secret.redisToken;
    const encryptKey = this.secret.encryptKey;
    // eslint-disable-next-line require-atomic-updates
    this.encryptKey = encryptKey;

    // eslint-disable-next-line require-atomic-updates
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

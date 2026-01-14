const {AWSConnector} = require('../connector/index.js');
const Redis = require('ioredis');
const CacheKeyAccess = require('../connector/cacheKeyAccess.js');

const log = require('../util/logUtil.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.environment;
    this.region = env.region;
    this.secretName = env.secretName;
    this.boomiOauthEndpoint = env.boomiOauthEndpoint;
    this.boomiServiceEndpoint = env.boomiServiceEndpoint;

    this.auth0CustomDomain = env.auth0CustomDomain;
    this.auth0Host = env.auth0Host;
    this.auth0AuthorizePath = env.auth0AuthorizePath;
    this.auth0TokenPath = env.auth0TokenPath;
    this.auth0RevokePath = env.auth0RevokePath;
    this.auth0ClientId = env.auth0ClientId;
    this.auth0Audience = env.auth0Audience;
    this.auth0RedirectUri = env.callback_url;
    this.auth0ProfessionalApps = env.auth0ProfessionalApps?.split(',') || [];
    this.auth0RecipientConnectionName = env.auth0RecipientConnectionName;
    this.auth0ProfessionalConnectionName = env.auth0ProfessionalConnectionName;

    this.redisPort = env.RedisPort;
    this.redisHost = env.RedisHostname;
    this.drxBaseUrl = env.DRXBaseUrl;
    this.drxGetAccountPath = env.DRXGetAccountPath;
    this.blacklistSeconds = env.blacklistSeconds;
    this.publicKey = env.publicKey;
    this.userSessionPrefix = env.userSessionPrefix;
    this.userSessionSeconds = env.userSessionSeconds;
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

    // eslint-disable-next-line require-atomic-updates
    this.awsSecretStr = await AWSConnector.getSecret(
      this.region,
      this.secretName
    );

    log.debug('Configuration before getSecret: ');
    log.debug(this);

    this.secret = JSON.parse(this.awsSecretStr);
    this.auth0ClientSecret = this.secret.auth_clientSecret;
    this.permissions = this.secret.permissions;
    this.boomiAuth0ApiKey = this.secret.boomiAuth0ApiKey;
    this.boomiAuth0ClientId = this.secret.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = this.secret.boomiAuth0ClientSecret;
    this.errorUsers =
      this.secret.errorUsers && (JSON.parse(this.secret.errorUsers) || []);

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

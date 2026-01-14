'use strict';

const {AWSConnector} = require('../connector/index.js');
const Redis = require('ioredis');
const CacheKeyAccess = require('../connector/cacheKeyAccess');

const {log} = require('../util/index.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.environment;
    this.region = env.region;
    this.secretName = env.secretName;
    this.pmEndpoint = env.pmEndpoint;
    this.odEndpoint = env.odEndpoint;
    this.boomiCognitoOauthEndpoint = env.boomiCognitoOauthEndpoint;
    this.boomiOauthEndpoint = env.boomiOauthEndpoint;
    this.boomiServiceEndpoint = env.boomiServiceEndpoint;
    this.redisPort = env.redisPort;
    this.redisHost = env.redisHostname;
    this.prefixName = env.prefixName;
    this.userSessionPrefix = env.userSessionPrefix;
    this.userSessionSeconds = Number.parseInt(env.userSessionSeconds, 10);
    this.oDataOrderTypes = env.oDataOrderTypes || '';
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
    this.boomiCognitoApiKey = this.secret.boomiCognitoApiKey;
    this.boomiCognitoClientId = this.secret.boomiCognitoClientId;
    this.boomiCognitoClientSecret = this.secret.boomiCognitoClientSecret;
    this.boomiAuth0ApiKey = this.secret.boomiAuth0ApiKey;
    this.boomiAuth0ClientId = this.secret.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = this.secret.boomiAuth0ClientSecret;
    this.odUsername = this.secret.od_env_username;
    this.odPassword = this.secret.od_env_password;

    const redisPassword = this.secret.redisToken;

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

const {awsConnector, RedisCacheConnector} = require('../connector/index.js');
const {ConfigurableKeyCache, keysCache} = require('../cache/index.js');
const {log} = require('../common/utils/index.js');

const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

class EnvironmentConfiguration {
  constructor(env) {
    this.env = env.environment;
    this.region = env.region;
    this.secretName = env.SMSFIntegration;
    this.sfHostname = env.SFHostname;
    this.sfClientId = env.SFClientID;
    this.sfUserName = env.SFUsername;
    this.scEndpoint = env.SCEndpoint;
    this.boomiOauthEndpoint = env.boomiOauthEndpoint;
    this.boomiServiceEndpoint = env.boomiServiceEndpoint;
    this.redisPort = env.RedisPort;
    this.redisHost = env.RedisHostname;
    this.redisTokenKey = env.redisTokenKey;
    this.geoNames = {};
    this.prefixName = env.prefixName;
    this.appName = env.appName;
    this.subSeparator = env.subSeparator;
    this.separator = env.separator;
    this.userSessionPrefix = env.userSessionPrefix;
    this.cacheSeconds = Number.parseInt(env.cacheSeconds, 10);
    this.secretCacheSeconds = Number.parseInt(env.secretCacheSeconds, 10);
    this.isScHttpAgent = env.isScHttpAgent;
  }

  isTestEnvironment() {
    const envLowerCase = this.env.toLowerCase();
    return (
      envLowerCase === 'dev' || envLowerCase == 'sit' || envLowerCase === 'uat'
    );
  }

  initiateCache(redisPort, redisHost, redisPassword) {
    // defines the default configuration for redis key generation
    // supports compatibility between the original and new redis key generation.
    const keyConfig = {
      // action - function to generate key - ie: keysCache.getKey || keysCache.getOriginalKey
      action: keysCache.getKey,
      // defines other object properties used to generate key.
      env: this.env,
      prefixName: this.prefixName,
      appName: this.appName,
      subSeparator: this.subSeparator,
      separator: this.separator
      // logicName:'',
      // identity:'',
    };

    // sets the default configuration for redis key generation
    const cacheKey = new ConfigurableKeyCache(keyConfig, 'get');

    // In most cases, to use redis cache actions (get, save etc..) pass the {logicName:'',identity:''} as the keyConfig.
    // ie logicName='boomi-headerFooter' identity='1231231111'
    // if required to use the original redis key generation add the {action:keysCache.getOriginalKey} to the keyConfig
    return new RedisCacheConnector(cacheKey, {
      port: IS_LOCAL ? 6379 : redisPort,
      host: IS_LOCAL ? 'localhost' : redisHost,
      password: redisPassword,
      tls: IS_LOCAL ? {rejectUnauthorized: false} : {}
    });
  }

  async init() {
    log.debug('before get secret');

    this.awsSecretStr = await awsConnector.getSecret(
      this.region,
      this.secretName,
      this.secretCacheSeconds
    );

    log.debug('Configuration before getSecret: ');
    log.debug(this);

    this.secret = JSON.parse(this.awsSecretStr);

    this.boomiConfigsApiKey = this.secret.boomiConfigsApiKey;
    this.boomiAuth0ClientId = this.secret.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = this.secret.boomiAuth0ClientSecret;
    this.scApiKey = this.secret.sc_apikey;

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

    this.cacheRepo = this.initiateCache(
      this.redisPort,
      this.redisHost,
      redisPassword
    );

    log.debug('finished loadParams: ');
    log.debug(this);
  }
}

module.exports = EnvironmentConfiguration;

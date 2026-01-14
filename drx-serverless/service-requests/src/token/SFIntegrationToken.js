'use strict';

const _ = require('lodash');
const jsforce = require('jsforce');
const {log, utils} = require('../util/index.js');

class SFIntegrationToken {
  constructor({
    cache,
    redisTokenKey,
    tokenSessionSeconds,
    sfHostname,
    sfClientId,
    sfUserName,
    secret
  }) {
    this.cache = cache;
    this.redisTokenKey = redisTokenKey;
    this.tokenSessionSeconds = tokenSessionSeconds;

    this.sfIntegrationCredentials = this.getSFIntegrationCreds(
      sfHostname,
      sfClientId,
      sfUserName,
      secret
    );
    log.debug('in SFIntegrationConnector, this.sfIntegrationCredentials: ');
    log.debug(this.sfIntegrationCredentials);
    this.jsConnection = new jsforce.Connection({
      oauth2: {
        loginUrl: 'https://' + this.sfIntegrationCredentials.hostname,
        clientId: this.sfIntegrationCredentials.clientId,
        clientSecret: this.sfIntegrationCredentials.clientSecret
      }
    });
  }

  async getFromCache(key) {
    return await this.cache.get(key);
  }

  async saveInCache(key, value, seconds) {
    await this.cache.save(key, JSON.stringify(value), seconds);
  }

  async getCacheToken() {
    const integrationToken = await this.getFromCache(this.redisTokenKey);
    let token;
    if (_.isEmpty(integrationToken)) {
      token = await this.getToken();
      log.debug('SFIntegrationToken, getIntegrationToken save token.');
      await this.saveInCache(
        this.redisTokenKey,
        token,
        this.tokenSessionSeconds
      );
    } else {
      token = JSON.parse(integrationToken);
    }
    log.debug('SFIntegrationToken, getIntegrationToken token:');
    log.debug(token);
    return token;
  }

  async getToken() {
    await this.jsConnection.login(
      this.sfIntegrationCredentials.username,
      this.sfIntegrationCredentials.password +
        this.sfIntegrationCredentials.secretToken
    );
    const connectedCreds = _.cloneDeep(this.sfIntegrationCredentials);
    connectedCreds.instanceUrl = this.jsConnection.instanceUrl;
    connectedCreds.accessToken = this.jsConnection.accessToken;
    return connectedCreds;
  }

  getSFIntegrationCreds(hostname, clientId, userName, secret) {
    if (!utils.checkAllArgsNotEmpty(arguments)) {
      throw new Error('invalid input.');
    }

    const credentials = {
      hostname: hostname,
      clientSecret: secret.clientSecret,
      clientId: clientId,
      username: userName,
      password: secret.password,
      secretToken: secret.secret
    };

    return credentials;
  }
}

module.exports = SFIntegrationToken;

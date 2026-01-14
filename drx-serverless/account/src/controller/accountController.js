'use strict';
const AccountService = require('../service/accountService');

const {log} = require('../util/index');
const _ = require('lodash');

const USER_CACHE_KEY_PREFIX = 'cacheUserInfo-';
const USER_ACCOUNT_KEY_PREFIX = 'account-getAccount-';
const USER_PROFILE_KEY_PREFIX = 'getProfile-';

class AccountController {
  constructor(userFlow, config) {
    log.debug('AccountController constructor');
    log.debug(userFlow, config);
    this.encryptKey = config.encryptKey;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
    this.userSessionSeconds = config.userSessionSeconds;
    this.accountService = new AccountService(userFlow, config);
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  async removeCacheEntry(sub, obj) {
    await this.cache.deleteCustomKeyInCache(
      this.userSessionPrefix,
      USER_CACHE_KEY_PREFIX + sub
    );
    await this.cache.deleteCustomKeyInCache(
      this.userSessionPrefix,
      USER_PROFILE_KEY_PREFIX + obj
    );

    if (sub !== obj) {
      // carer
      await this.cache.deleteCustomKeyInCache(
        this.userSessionPrefix,
        USER_ACCOUNT_KEY_PREFIX + sub + '-' + sub
      );
    }

    await this.cache.deleteCustomKeyInCache(
      this.userSessionPrefix,
      USER_ACCOUNT_KEY_PREFIX + sub + '-' + obj
    );

    //this.cache.disconnect();
  }

  async getAccount({obj, sub, sub_userType, countryCode}) {
    const accountStr = await this.getFromCache(
      this.userSessionPrefix,
      USER_ACCOUNT_KEY_PREFIX + sub + '-' + obj
    );

    if (!_.isEmpty(accountStr) && !_.isEmpty(JSON.parse(accountStr))) {
      return JSON.parse(accountStr);
    }
    log.debug('AccountController, getAccount - : without cached entry');
    log.debug(accountStr);

    const accountResponse = await this.accountService.getAccount({
      sub,
      sub_userType,
      countryCode,
      obj
    });

    log.debug('AccountController, getAccount - : accountResponse');
    log.debug(accountResponse);

    await this.saveInCache(
      this.userSessionPrefix,
      USER_ACCOUNT_KEY_PREFIX + sub + '-' + obj,
      accountResponse,
      this.userSessionSeconds
    );

    return accountResponse;
  }

  async getUserIdentity({obj, sub, sub_userType, countryCode}) {
    const identityResponse = await this.accountService.getUserIdentity({
      sub,
      sub_userType,
      countryCode,
      obj
    });

    log.debug('AccountController, getUserIdentity - : identityResponse');
    log.debug(identityResponse);

    return identityResponse;
  }

  async patchAccount(payload, context) {
    log.debug('payload');
    log.debug(payload);

    const obj = payload.request.customerIdentifier;

    log.debug('AccountController, patchAccount - : obj');
    log.debug(obj);

    const resp = await this.accountService.patchAccount(payload, context, obj);

    log.debug('AccountController, patchAccount - : resp');
    log.debug(resp);

    await this.removeCacheEntry(context.sub, obj);

    return resp;
  }
}

module.exports = AccountController;

'use strict';
const {USER_FLOW} = require('../util/index');

const BoomiAccountService = require('./boomiAccountService');
const SFAccountService = require('./sfAccountService');

class AccountService {
  constructor(userFlow, config) {
    this.config = config;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;

    if (userFlow === USER_FLOW.DEFAULT) {
      this.accountService = new SFAccountService(config);
    } else if (userFlow === USER_FLOW.SAGE) {
      this.accountService = new BoomiAccountService(config);
    }
  }

  async patchAccount(payload, context, obj) {
    return await this.accountService.patchAccount(payload, context, obj);
  }

  async getAccount(params) {
    return await this.accountService.getAccount(params);
  }

  async getUserIdentity(params) {
    return await this.accountService.getUserIdentity(params);
  }
}

module.exports = AccountService;

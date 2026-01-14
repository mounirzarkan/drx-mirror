'use strict';

const {USER_FLOW} = require('../util/index.js');

const BoomiAddressService = require('./boomiAddressService');
const SFAddressService = require('./sfAddressService');

class AddressService {
  constructor(userFlow, config) {
    this.encryptKey = config.encryptKey;
    if (userFlow === USER_FLOW.DEFAULT) {
      this.addressService = new SFAddressService(config);
    } else if (userFlow === USER_FLOW.SAGE) {
      this.addressService = new BoomiAddressService(config);
    }
  }

  async retrieveAddress(params) {
    return await this.addressService.retrieveAddress(params);
  }

  async updateAddress(request, context, obj) {
    return await this.addressService.updateAddress(request, context, obj);
  }

  async patchAddress(request, context, obj) {
    return await this.addressService.patchAddress(request, context, obj);
  }

  async readAddress(params) {
    return await this.addressService.readAddress(params);
  }
}

module.exports = AddressService;

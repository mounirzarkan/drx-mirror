'use strict';
const AddressService = require('../service/addressService.js');
const _ = require('lodash');
const {log} = require('../util/index.js');
const CACHE_KEY_PREFIX = 'address-getAddress-';

class AddressController {
  constructor(userFlow, config) {
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
    this.userSessionSeconds = config.userSessionSeconds;
    // this.cacheKeyService = new CacheKeyService(config);
    this.addressService = new AddressService(userFlow, config);
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  removeCacheEntry(sub, obj) {
    this.cache.deleteCustomKeyInCache(
      this.userSessionPrefix,
      CACHE_KEY_PREFIX + sub + '-' + obj
    );

    this.cache.disconnect();
  }

  async retrieveAddress({obj, sub, sub_userType, countryCode, addressId}) {
    //obj is id query param
    //sub is requestor

    
    // TODO: temporary disable caching due to address tagging 
    // INTS-1271
    /**
    const addressStr = await this.getFromCache(
      this.userSessionPrefix,
      CACHE_KEY_PREFIX + sub + '-' + obj + (addressId ? `-${addressId}` : '')
    );

    log.debug('addressController, retrieveAddress addressStr:');
    log.debug(addressStr);

    if (!_.isEmpty(addressStr) && !_.isEmpty(JSON.parse(addressStr))) {
      return JSON.parse(addressStr);
    }
    */
    let addressWithPermission;
    if (addressId) {
      addressWithPermission = await this.addressService.readAddress({
        sub,
        sub_userType,
        countryCode,
        obj,
        addressId
      });
    } else {
      addressWithPermission = await this.addressService.retrieveAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      });
    }

    log.debug('addressController, retrieveAddress addressWithPermission:');
    log.debug(addressWithPermission);

    // TODO: temporary disable caching due to address tagging 
    // INTS-1271
    /**
    await this.saveInCache(
      this.userSessionPrefix,
      CACHE_KEY_PREFIX + sub + '-' + obj + (addressId ? `-${addressId}` : ''),
      addressWithPermission,
      this.userSessionSeconds
    );
    */
    return addressWithPermission;
  }

  // Note : this is actually a post, NOT a PATCH
  async updateAddress(request, context) {
    const obj = request.customerIdentifier;

    log.debug('addressController, updateAddress obj:');
    log.debug(obj);

    const resp = await this.addressService.updateAddress(request, context, obj);

    // TODO: temporary disable caching due to address tagging 
    // INTS-1271
    // this.removeCacheEntry(context.sub, obj);

    return resp;
  }

  async patchAddress(request, context) {
    const obj = request.customerIdentifier;

    log.debug('addressController, patchAddress obj:');
    log.debug(obj);

    const resp = await this.addressService.patchAddress(request, context, obj);

    // TODO: temporary disable caching due to address tagging 
    // INTS-1271
    // this.removeCacheEntry(context.sub, obj);

    return resp;
  }
}

module.exports = AddressController;

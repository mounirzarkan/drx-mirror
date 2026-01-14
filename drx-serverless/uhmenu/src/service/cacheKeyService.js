const _ = require('lodash');

('use restrict');

const APP_NAME = 'drx';
const UH_KEY = 'uhmenu';
const SEPARATOR = '_';
const SUB_SEPARATOR = '-';
const USER_CACHE_KEY_PREFIX = 'cacheUserInfo-';

class CacheKeyService {
  constructor(config) {
    this.env = _.toLower(config._env);
  }

  getKey(logicName, identity) {
    return (
      this.env +
      SEPARATOR +
      APP_NAME +
      SUB_SEPARATOR +
      logicName +
      SEPARATOR +
      identity
    );
  }

  getUHmenuConfigkey(country, lng) {
    return this.getKey(UH_KEY, lng.toLowerCase() + '-' + country.toUpperCase());
  }

  getUserInfoKey(userSessionPrefix, cochlear_id) {
    return userSessionPrefix + USER_CACHE_KEY_PREFIX + cochlear_id;
  }
}

module.exports = CacheKeyService;

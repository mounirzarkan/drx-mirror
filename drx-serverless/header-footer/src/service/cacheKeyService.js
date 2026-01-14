const _ = require('lodash');

('use restrict');

const APP_NAME = 'drx';
const HF_KEY = 'headerFooter';
const SEPARATOR = '_';
const SUB_SEPARATOR = '-';

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

  getBoomiHeaderFooterKey(lng, country) {
    return this.getKey(HF_KEY, lng.toLowerCase() + '-' + country.toUpperCase());
  }
}

module.exports = CacheKeyService;

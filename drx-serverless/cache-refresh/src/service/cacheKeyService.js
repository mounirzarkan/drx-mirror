'use strict';

const PREFIX_NAME = 'drx';
const APP_NAME = 'cacheRefresh';
const SUB_SEPARATOR = '-';
const SEPARATOR = '_';
const WILDCARD = '*';
class CacheKeyService {
  constructor(config) {
    this.env = config.env.toLowerCase();
  }

  getAppName() {
    return APP_NAME;
  }

  getOriginalWildcardPattern(prefixName, appName, logicName) {
    let key = prefixName ? prefixName + SUB_SEPARATOR : '';
    key += this.env + SUB_SEPARATOR;
    key += appName + SUB_SEPARATOR;

    if (logicName) {
      key += logicName + SUB_SEPARATOR;
    }
    return key + WILDCARD;
  }

  getWildcardPattern(prefixName, appName, logicName) {
    let key = this.env + SEPARATOR;

    key += prefixName ? prefixName + SUB_SEPARATOR : '';

    if (appName) {
      key += appName;
    }

    if (logicName) {
      key += SEPARATOR + logicName;
    }
    return key + SEPARATOR + WILDCARD;
  }

  getKey(logicName, identity) {
    return (
      this.env +
      SEPARATOR +
      PREFIX_NAME +
      SUB_SEPARATOR +
      APP_NAME +
      SEPARATOR +
      logicName +
      SEPARATOR +
      identity
    );
  }
}

module.exports = CacheKeyService;

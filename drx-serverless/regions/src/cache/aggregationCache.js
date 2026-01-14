'use strict';
const {log} = require('../common/utils/index.js');

class AggregationCache {
  constructor(cache) {
    this.cache = cache;
  }

  async getVacancySave(
    cacheConfig,
    getData = () => {},
    cacheSeconds = 7200,
    options = {
      formatDataSave: JSON.stringify,
      parseCacheResponse: JSON.parse
    }
  ) {
    let response = await this.cache.get(cacheConfig);

    log.debug('AggregationCache - getVacancySave - get cache response: ');
    log.debug(response);

    if (response === undefined || response === null) {
      response = await getData();
      if (response) {
        const saveResponse = options.formatDataSave(response);
        await this.cache.save(cacheConfig, saveResponse, cacheSeconds);
      }
      log.debug(
        'AggregationCache - getVacancySave - retrievalMethod - response: '
      );
      log.debug(response);
    } else {
      response = options.parseCacheResponse(response);
    }

    log.debug('AggregationCache - getVacancySave - response: ');
    log.debug(response);
    return response;
  }
}

module.exports = AggregationCache;

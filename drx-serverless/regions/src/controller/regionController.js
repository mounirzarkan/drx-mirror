'use strict';
const services = require('../service/index.js');
const {log} = require('../common/utils/index.js');
const {AggregationCache} = require('../cache/index.js');

class RegionController {
  constructor(config) {
    log.info('RegionController-Config:');
    log.info(config);
    log.info(Object.keys(config));
    log.info(config.sc_endpoint);

    this.encryptKey = config.encryptKey;

    this.aggregationCache = new AggregationCache(config.cacheRepo);
    this.userSessionPrefix = config.userSessionPrefix;
    this.cacheSeconds = config.cacheSeconds;

    const {RegionService} = services;

    this.regionService = new RegionService(config);
  }

  async retrieveCountryData(countryCode, lng, source) {
    log.info('enter retrieveCountryData - countryCode: ' + countryCode);
    log.info('enter retrieveCountryData - lng: ' + lng);
    log.info('enter retrieveCountryData - source: ' + source);

    // defines cache redis key generation.
    const cacheConfig = {
      logicName: 'getRegions',
      identity: '' + countryCode + lng + source
    };

    // handles cache associated logic
    // get from cache, if not found then get from function and then save result to cache returning response.
    const data = await this.aggregationCache.getVacancySave(
      cacheConfig,
      // function to gather & process data before saving to cache
      this.regionService.retrieveCountryData.bind(
        this.regionService,
        countryCode,
        lng,
        source
      ),
      this.cacheSeconds
    );

    log.info('retrieveCountryData:');
    log.info(data);
    return data;
  }
}

module.exports = RegionController;

'use strict';
const {log} = require('../common/utils/index.js');
const Geonames = require('geonames.js');
const {concat, sortBy} = require('lodash');
const {
  ChainValidation,
  PropertyValidation,
  sanitize
} = require('../validation/index.js');
const SCConnector = require('../connector/SCConnector.js');
const BOOMIConnector = require('../connector/BOOMIConnector.js');

class RegionService {
  constructor(config) {
    this.geoNames_config = config.geoNames;
    this.countryLevels = config.geoNamesLevels;
    this.geonames = null;
    this.scConnector = null;
    this.boomiConnector = null;
    this.config = config;

    const chainValidation = new ChainValidation({maxLength: 200});
    this.propertyValidator = new PropertyValidation(
      chainValidation.createChain(),
      'RegionService validation error at countryData'
    );
  }

  async retrieveCountryData(countryCode, lng, src) {
    if (!countryCode) {
      return await this.retrieveAllCountryDataGN(lng);
    }

    if (src === 'sc') {
      return await this.retrieveCountryDataSC(countryCode, lng);
    }

    if (src === 'sfhc') {
      return await this.retrieveCountryDataBOOMI(countryCode, lng);
    }

    return await this.retrieveCountryDataGN(countryCode, lng);
  }

  async retrieveCountryDataSC(countryCode, lng) {
    this.geoNames_config.lan = lng.toLowerCase();
    this.geonames = Geonames(this.geoNames_config);

    log.info('regionService.retrieveCountryData - geonames');
    log.info(this.geonames);

    log.info('regionService.retrieveCountryData - countryCode, lng');
    log.info(countryCode);
    log.info(lng);

    const resp1 = await this.geonames.countryInfo({});
    log.info('regionService.retrieveCountryData - geonames resp');
    log.info(resp1);

    const country = resp1.geonames.filter(
      (x) => x.countryCode === countryCode.toUpperCase()
    );

    log.info('regionService.retrieveCountryData - country');
    log.info(country);

    this.scConnector = new SCConnector(
      this.config.scEndpoint,
      this.config.scApiKey,
      this.config.isScHttpAgent
    );

    log.info('regionService.retrieveCountryData - after SCConnector');

    let myCountry = {
      code: countryCode
    };

    log.info('regionService.retrieveCountryData - myCountry');
    log.info(myCountry);

    if (country[0]) {
      myCountry = {
        id: country[0].geonameId,
        code: country[0].countryCode,
        isoCode: country[0].isoAlpha3,
        languages: country[0].languages.split(','),
        name: country[0].countryName,
        postalCodeFormat: country[0].postalCodeFormat,
        currencyCode: country[0].currencyCode
      };
    }

    log.info('regionService.retrieveCountryData - myCountry country[0]');
    log.info(myCountry);

    const resp = await this.scConnector.getRegionsResponse(countryCode, lng);

    log.info('regionService.retrieveCountryData - resp');
    log.info(resp);

    const mapped = resp.item.children.map((x) => {
      return {
        name: x.name?.value,
        name2: x.displayName,
        code: x.code?.value,
        abbr: x.code?.value
      };
    });

    return {
      country: myCountry,
      regions: mapped
    };
  }

  async retrieveCountryDataGN(countryCode, lng) {
    this.geoNames_config.lan = lng.toLowerCase();
    this.geonames = Geonames(this.geoNames_config);

    log.info('regionService.retrieveCountryDataGN - geonames');
    log.info(this.geonames);

    log.info('regionService.retrieveCountryDataGN - countryCode, lng');
    log.info(countryCode);
    log.info(lng);

    const resp = await this.geonames.countryInfo({});
    log.info('regionService.retrieveCountryDataGN - geonames resp');
    log.info(resp);

    const country = resp.geonames.filter(
      (x) => x.countryCode === countryCode.toUpperCase()
    );

    log.info('regionService.retrieveCountryDataGN - country');
    log.info(country);

    const level = this.countryLevels[countryCode.toUpperCase()];

    let myRegions = [];
    let regions = await this.geonames.children({
      geonameId: country[0].geonameId
    });

    if (level == 3) {
      let culmunated = [];

      for (const key in regions.geonames) {
        if (Object.hasOwnProperty.call(regions.geonames, key)) {
          const region = regions.geonames[key];
          const regions2 = await this.geonames.children({
            geonameId: region.geonameId
          });
          culmunated = concat(culmunated, regions2.geonames);
        }
      }
      regions = culmunated;
      const abbrRegions = regions.map((x) => {
        log.info('regionService.retrieveCountryDataGN - abbrRegions x');
        log.info(x);
        return {
          geonameId: x.geonameId,
          abbr: x.name,
          name: x.name
        };
      });
      myRegions = sortBy(abbrRegions, [
        function (o) {
          return o.name;
        }
      ]);
    } else {
      myRegions = regions.geonames.map((x) => {
        log.info('regionService.retrieveCountryDataGN - myRegions x');
        log.info(x);
        return {
          geonameId: x.geonameId,
          abbr: x.adminCodes1.ISO3166_2,
          name: x.adminName1,
          name2: x.name,
          toponymName: x.toponymName
        };
      });
    }

    log.info('regionService.retrieveCountryDataGN - country[0]');
    log.info(country[0]);

    log.info('regionService.retrieveCountryDataGN - myRegions');
    log.info(myRegions);

    sanitize.clean(country[0]);
    log.info(
      'regionService.retrieveCountryDataGN - Sanitized country[0] schema:'
    );
    log.info(country[0]);

    sanitize.clean(myRegions);
    log.info(
      'regionService.retrieveCountryDataGN - Sanitized myRegions schema:'
    );
    log.info(myRegions);

    const countryData = {
      country: {
        id: country[0].geonameId,
        code: country[0].countryCode,
        isoCode: country[0].isoAlpha3,
        languages: country[0].languages.split(','),
        name: country[0].countryName,
        postalCodeFormat: country[0].postalCodeFormat,
        currencyCode: country[0].currencyCode
      },
      regions: myRegions
    };
    log.info('regionService.retrieveCountryDataGN - countryData:');
    log.info(countryData);

    // if max string length is greater than 200 throw error and log it - example: 'RegionService validation error at countryData.country.code'
    return this.propertyValidator.validateInput(countryData);
  }

  async retrieveCountryDataBOOMI(countryCode, lng) {
    log.info('regionService.retrieveCountryDataBOOMI - countryCode, lng');

    log.info(countryCode);
    log.info(lng);

    this.geoNames_config.lan = lng.toLowerCase();
    this.geonames = Geonames(this.geoNames_config);

    log.info('regionService.retrieveCountryDataBOOMI - geonames');
    log.info(this.geonames);

    const resp1 = await this.geonames.countryInfo({});
    log.info('regionService.retrieveCountryDataBOOMI - geonames resp');
    log.info(resp1);

    const country = resp1.geonames.filter(
      (x) => x.countryCode === countryCode.toUpperCase()
    );

    log.info('regionService.retrieveCountryDataBOOMI - country');
    log.info(country);

    let mappedCountry;

    if (country[0]) {
      mappedCountry = {
        id: country[0].geonameId,
        code: country[0].countryCode,
        isoCode: country[0].isoAlpha3,
        languages: country[0].languages.split(','),
        name: country[0].countryName,
        postalCodeFormat: country[0].postalCodeFormat,
        currencyCode: country[0].currencyCode
      };
    }

    log.info('regionService.retrieveCountryDataBOOMI - mappedCountry');
    log.info(mappedCountry);

    this.boomiConnector = new BOOMIConnector(this.config);

    const resp2 = await this.boomiConnector.getStatesConfig(
      countryCode.toUpperCase()
    );
    log.info('regionService.retrieveCountryDataBOOMI - boomi resp');
    log.info(resp2);

    const states = resp2.states || [];

    log.info('regionService.retrieveCountryDataBOOMI - states');
    log.info(states);

    let mappedStates;

    if (states) {
      mappedStates = states.map((x) => {
        return {
          name: x.stateName,
          abbr: x.stateCode
        };
      });
    }

    log.info('regionService.retrieveCountryDataBOOMI - mappedStates');
    log.info(mappedStates);

    return {
      country: mappedCountry,
      regions: mappedStates || []
    };
  }

  async retrieveAllCountryDataGN(lng = 'en') {
    this.geoNames_config.lan = lng.toLowerCase();
    this.geonames = Geonames(this.geoNames_config);

    log.info('regionService.retrieveAllCountryDataGN - geonames');
    log.info(this.geonames);

    const resp = await this.geonames.countryInfo({});
    log.info('regionService.retrieveAllCountryDataGN - geonames resp');
    log.info(resp);

    return resp.geonames;
  }

  async search(searchTerm) {
    try {
      return this.geonames.search({q: searchTerm});
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = RegionService;

'use strict';

const _ = require('lodash');
const axios = require('axios');
const SCConnector = require('../connector/SCConnector.js');
const {translationMapping} = require('../mappers/scMapper.js');
const gqlQuery = require('../common/data/gqlQuery.js');
const {log} = require('../common/utils/index.js');

const PREFIX = 'drx-';
const CACHE_KEY_PREFIX = 'addressConfig';

class GetAddressConfigCommand {
  constructor(config) {
    this.regionsEndpoint = config.regionsEndpoint;
    this.scEndpoint = config.scEndpoint;
    this.scApiKey = config.scApiKey;
    this.isScHttpAgent = config.isScHttpAgent;
    this.userSessionSeconds = config.userSessionSeconds;
    this.env = config.env;
    this.cache = config.cache;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  async getRegions(countryCode, lng, src) {
    log.debug('getRegions, countryCode:');
    log.debug(countryCode);

    const url = `${this.regionsEndpoint}/?country=${countryCode}&lng=${lng}&src=${src}`;

    const resp = (await axios.get(url)).data.data;
    return resp;
  }

  async execute(countryCode, languageCode, src) {
    try {
      const cacheStr = await this.getFromCache(
        this.env + '_' + PREFIX,
        CACHE_KEY_PREFIX
      );

      log.debug('GetAddressConfigCommand execute: - cacheStr');
      log.debug(cacheStr);

      if (!_.isEmpty(cacheStr) && !_.isEmpty(JSON.parse(cacheStr))) {
        return JSON.parse(cacheStr);
      }

      const sc = new SCConnector(
        this.scEndpoint,
        this.scApiKey,
        this.isScHttpAgent
      );

      log.debug('getAddressConfigCommand: sc');
      log.debug(sc);

      const url = sc.createUrl(countryCode, languageCode);
      const readQry = gqlQuery.getAddressConfigQuery_read(countryCode);
      const editQry = gqlQuery.getAddressConfigQuery_edit(countryCode);
      const settingsQry = gqlQuery.getAddressConfigQuery_settings(countryCode);

      log.debug('getAddressConfigCommand: url');
      log.debug(url);

      const requestHeaders = {};

      const [readData, editData, settingsData, regionsData] = await Promise.all(
        [
          sc.getGQLresponse(
            url,
            readQry,
            {
              path: `/sitecore/content/cds/Address configuration/${countryCode}/read`,
              language: translationMapping(countryCode, languageCode)
            },
            requestHeaders
          ),
          sc.getGQLresponse(
            url,
            editQry,
            {
              path: `/sitecore/content/cds/Address configuration/${countryCode}/edit`,
              language: translationMapping(countryCode, languageCode)
            },
            requestHeaders
          ),
          sc.getGQLresponse(
            url,
            settingsQry,
            {
              path: `/sitecore/content/cds/Address configuration/${countryCode}`,
              language: translationMapping(countryCode, languageCode)
            },
            requestHeaders
          ),
          this.getRegions(countryCode, languageCode, src)
        ]
      );

      log.debug('getAddressConfigCommand read, edit, settings, regions');
      log.debug(readData);
      log.debug(editData);
      log.debug(settingsData);
      log.debug(regionsData);

      const data = {
        config: {
          foundation: this.foundationFieldMapping(
            readData.read,
            editData.edit,
            settingsData.settings,
            regionsData.country
          ),
          adaptiveForm: {}
        },
        regions: regionsData.regions.map((x) => {
          return {label: x.toponymName, value: x.abbr};
        })
      };

      log.debug('getAddressConfigCommand: data');
      log.debug(data);

      await this.saveInCache(
        this.env + '_' + PREFIX,
        CACHE_KEY_PREFIX,
        data,
        this.userSessionSeconds
      );

      return data;
    } catch (e) {
      log.debug(e);
      throw 'Error retrieving address config';
    }
  }

  foundationFieldMapping(read, edit, settings, country) {
    return {
      disabled: false,
      googleMapsApiKey: settings?.googleMapsApiKey.value,

      saveLabel: settings?.saveLabel?.targetItem?.field?.value,
      cancelLabel: settings?.cancelLabel?.targetItem?.field?.value,
      savingLabel: settings?.savingLabel?.targetItem?.field?.value,
      savedLabel: settings?.savedLabel?.targetItem?.field?.value,

      labels: {
        hint: settings?.hintLabel?.targetItem?.field?.value,
        optional: settings?.optionalLabel?.targetItem?.field?.value,
        prompt: settings?.prompt?.targetItem?.field?.value,
        promptMobile: settings?.promptMobile?.targetItem?.field?.value,
        loading: settings?.loading?.targetItem?.field?.value,
        addressNotFoundText:
          settings?.addressNotFoundText?.targetItem?.field?.value,
        addressNotFoundButton:
          settings?.addressNotFoundButton?.targetItem?.field?.value,
        lookupErrorLabel: settings?.hintLabel?.targetItem?.field?.value,
        label: settings?.addressLabel?.targetItem?.field?.value
      },

      country: country.code,
      searchCharLength: parseInt(settings?.searchCharLength.value),

      fields: [
        ...edit.children.map((x) => {
          var validators = [];

          if (x?.validators.length > 0) {
            validators = x?.validators?.map((y) => {
              return {
                apifield: y?.apiField?.targetItem?.name,
                name: y?.name,
                type: y?.type.value,
                key: y?.key?.value == undefined ? '' : y?.key?.value,
                message:
                  y?.message?.targetItem?.field?.value == undefined
                    ? ''
                    : y?.message?.targetItem?.field?.value
              };
            });
          }

          return {
            id: x?.name,
            name: x?.name,
            type: x?.type?.value,
            label: x?.label?.targetItem?.field?.value,
            apifield: x?.apiField?.targetItem.field?.value,
            promptText: x?.promptText?.targetItem?.field?.value,
            optionalText: x?.optionalText?.targetItem?.field?.value,
            hint: x?.hint?.targetItem?.field?.value,
            validators: validators
          };
        }),
        {
          id: 'isPO',
          name: 'isPO',
          label: edit?.isPO.targetItem?.field?.value,
          validators: []
        }
      ],

      cityState: settings?.cityState.value,
      edit: settings?.editLabel?.value,
      cancel: settings?.cancelLabel?.targetItem?.field?.value,

      postcodeMask: country.postalCodeFormat,

      addressAPIState: {
        addressAPIStateTypeId: settings?.addressAPIStateTypeId.value,
        addressAPIStateName: settings?.addressAPIStateName.value
      }
    };
  }
}

module.exports = GetAddressConfigCommand;

'use strict';

const _ = require('lodash');
const axios = require('axios');
const {log} = require('../common/utils/index.js');

const PREFIX = 'drx-';
const CACHE_KEY_PREFIX = 'dictionaryItems';

class GetDictionaryItemsCommand {
  constructor(config) {
    this.scAuthorEndpoint = config.scAuthorEndpoint;
    this.scApiKey = config.scApiKey;
    this.isScHttpAgent = config.isScHttpAgent;
    this.dictionarySessionSeconds = config.dictionarySessionSeconds;
    this.env = config.env;
    this.cache = config.cache;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  async getDictionaryFromSitecore(languageCode) {
    try {
      const siteName = 'drx-us-en';
      const url = `${this.scAuthorEndpoint}/sitecore/api/jss/dictionary/drx/${languageCode}?sc_apikey=${this.scApiKey}&sc_site=${siteName}`;
      
      log.debug('Constructed JSS Dictionary URL:');
      log.debug(url);

      let requestConfig = {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      
      if (this.isScHttpAgent) {
        const https = require('https');
        requestConfig.httpsAgent = new https.Agent({
          rejectUnauthorized: false
        });
      }

      const response = await axios.get(url, requestConfig);
      
      log.debug('Response received');
      log.debug(response.data);
      
      return response.data || {
        lang: languageCode,
        app: "drx",
        phrases: {}
      };
      
    } catch (error) {
      log.error('Error fetching dictionary from Sitecore:', error.message);
      log.error('Error details:', error.response?.data || error);
      
      // Return empty JSS format structure on error
      return {
        lang: languageCode,
        app: "drx",
        phrases: {}
      };
    }
  }

  async execute(languageCode) {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}_${languageCode}`;
      
      const cacheStr = await this.getFromCache(
        this.env + '_' + PREFIX,
        cacheKey
      );

      log.debug('GetDictionaryItemsCommand execute: - cacheStr');
      log.debug(cacheStr);

      if (!_.isEmpty(cacheStr)) {
        try {
          const cachedData = JSON.parse(cacheStr);
          // Quick validation - just check if it has phrases property
          if (cachedData && cachedData.phrases) {
            log.debug('Returning cached dictionary data');
            return cachedData;
          }
        } catch (parseError) {
          log.debug('Error parsing cached data, fetching from Sitecore');
        }
      }

      log.debug('Cache miss, fetching from Sitecore');

      const dictionaryData = await this.getDictionaryFromSitecore(languageCode);

      log.debug('getDictionaryItemsCommand dictionaryData from Sitecore:');
      log.debug(dictionaryData);

      // Validate the response structure
      const validatedData = this.validateDictionaryResponse(dictionaryData, languageCode);

      log.debug('getDictionaryItemsCommand: final validated data');
      log.debug(validatedData);

      await this.saveInCache(
        this.env + '_' + PREFIX,
        cacheKey,
        validatedData,
        this.dictionarySessionSeconds
      );

      return validatedData;
    } catch (e) {
      log.error('Error in getDictionaryItemsCommand execute:');
      log.error(e);

      // Return a valid JSS structure even on error
      return {
        lang: languageCode,
        app: "drx",
        phrases: {}
      };
    }
  }

  validateDictionaryResponse(data, languageCode) {
    // Ensure we always return a valid JSS dictionary structure
    const validatedResponse = {
      lang: languageCode,
      app: "drx",
      phrases: {}
    };

    if (data && typeof data === 'object') {
      // If it already has the JSS structure, use it
      if (data.lang && data.app && data.phrases) {
        return {
          lang: data.lang,
          app: data.app,
          phrases: data.phrases || {}
        };
      }
      
      // If it's just phrases data, wrap it
      if (data.phrases) {
        validatedResponse.phrases = data.phrases;
      } else if (typeof data === 'object' && !data.lang && !data.app) {
        // If it's a flat object of key-value pairs, treat as phrases
        validatedResponse.phrases = data;
      }
    }

    return validatedResponse;
  }
}

module.exports = GetDictionaryItemsCommand;

'use strict';

const axios = require('axios');
const log = require('../util/logUtil.js');

class DRXConnector {
  constructor(params) {
    this.token = null;
    this.tokenUrl = params.boomiCognitoOauthEndpoint;
    this.boomiCognitoClientId = params.boomiCognitoClientId;
    this.boomiCognitoClientSecret = params.boomiCognitoClientSecret;
    this.connection = axios.create({
      baseURL: params.boomiServiceEndpoint,
      headers: {
        'x-api-key': params.boomiCognitoApiKey,
        'x-version': '1.0'
      }
    });
    this.env = params.env;
    this.cache = params.cache;

    // Add interceptor to inject Authorization header with Bearer token
    this.connection.interceptors.request.use(async (config) => {
      const token = await this.getToken();

      log.debug('DRX Connector, request interceptor: - token');
      log.debug(token);

      if (token) {
        config.headers.Authorization = `Bearer ${token.access_token}`;
      }

      log.debug('DRX Connector, request interceptor: - config');
      log.debug(config);

      return config;
    });

    // Add interceptor to handle cached tokens and token expiration
    this.connection.interceptors.response.use(
      (response) => response,
      async (error) => {
        log.debug('DRX Connector, response interceptor: - error');
        log.debug(error);

        const originalRequest = error.config;

        log.debug('DRX Connector, response interceptor: - originalRequest');
        log.debug(originalRequest);

        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          this.token !== null
        ) {
          originalRequest._retry = true;

          try {
            const payload = {
              grant_type: 'client_credentials',
              client_id: this.boomiCognitoClientId,
              client_secret: this.boomiCognitoClientSecret
            };

            const params = new URLSearchParams(payload);

            const {data} = await axios.post(this.tokenUrl, params.toString(), {
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            });

            log.debug('DRX Connector, response interceptor: - data');
            log.debug(data);

            this.token = data;

            // Store token in cache
            await this.cache.save(
              `${this.env}_drx-internal-boomiToken`,
              JSON.stringify(this.token),
              7200
            );

            return this.connection(originalRequest);
          } catch (error) {
            log.debug('DRX Connector, response interceptor: - get token error');
            console.error(error.response.data);

            return Promise.reject(error);
          }
        }

        log.debug('DRX Connector, response interceptor: - final error');
        console.error(error.response.data);

        return Promise.reject(error);
      }
    );
  }

  async getToken() {
    log.debug('DRX Connector, getToken: - this.token');
    log.debug(this.token);

    if (this.token) {
      return this.token;
    }

    // Find token in cache
    const cachedToken = await this.cache.get(
      `${this.env}_drx-internal-boomiToken`
    );
    log.debug('DRX Connector, getToken: - cachedToken');
    log.debug(cachedToken);

    if (cachedToken) {
      const parsedCachedToken = JSON.parse(cachedToken);

      log.debug('DRX Connector, getToken: - parsed cachedToken');
      log.debug(parsedCachedToken);

      return (this.token = parsedCachedToken);
    }

    try {
      const payload = {
        grant_type: 'client_credentials',
        client_id: this.boomiCognitoClientId,
        client_secret: this.boomiCognitoClientSecret
      };

      const params = new URLSearchParams(payload);

      const {data} = await axios.post(this.tokenUrl, params.toString(), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });

      log.debug('DRX Connector, getToken: data');
      log.debug(data);

      this.token = data;

      // Store token in cache
      await this.cache.save(
        `${this.env}_drx-internal-boomiToken`,
        JSON.stringify(this.token),
        7200
      );

      return this.token;
    } catch (error) {
      log.debug('DRX Connector, getToken: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  // API.ORDERS
  async getOrderHeadersAdditionalInfo(headerIds) {
    try {
      log.debug('DRXConnector, getOrderHeadersAdditionalInfo: - headerIds');
      log.debug(headerIds);

      console.time('DRX-getOrderHeadersAdditionalInfo');
      const resp = await this.connection.post(`/order/headers/search`, {
        ids: headerIds
      });
      console.timeEnd('DRX-getOrderHeadersAdditionalInfo');

      log.debug('DRXConnector, getOrderHeadersAdditionalInfo: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('DRX Connector, getOrderHeadersAdditionalInfo: - error');
      log.debug(error);

      throw new Error(error);
    }
  }

  // API.ORDERS
  async getOrderLinesAdditionalInfo(headerId) {
    try {
      log.debug('DRXConnector, getOrderLinesAdditionalInfo: - headerId');
      log.debug(headerId);

      console.time('DRX-getOrderLinesAdditionalInfo');
      const resp = await this.connection.get(`/order/headers/${headerId}`);
      console.timeEnd('DRX-getOrderLinesAdditionalInfo');

      log.debug('DRXConnector, getOrderLinesAdditionalInfo: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('DRX Connector, getOrderLinesAdditionalInfo: - error');
      log.debug(error);

      throw new Error(error);
    }
  }
}

module.exports = DRXConnector;

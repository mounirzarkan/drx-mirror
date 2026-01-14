'use strict';

const axios = require('axios');
const log = require('../util/logUtil.js');

class BOOMIConnector {
  constructor(params) {
    this.token = null;
    this.tokenUrl = params.boomiOauthEndpoint;
    this.boomiAuth0ClientId = params.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = params.boomiAuth0ClientSecret;
    this.connection = axios.create({
      baseURL: params.boomiServiceEndpoint,
      headers: {
        'x-api-key': params.boomiClinicsAuth0ApiKey,
        'x-version': '1.0'
      }
    });
    this.env = params.env;
    this.cache = params.cache;

    // Add interceptor to inject Authorization header with Bearer token
    this.connection.interceptors.request.use(async config => {
      const token = await this.getToken();

      log.debug('BOOMI Connector, request interceptor: - token');
      log.debug(token);

      if (token) {
        config.headers.Authorization = `Bearer ${token.access_token}`;
      }

      log.debug('BOOMI Connector, request interceptor: - config');
      log.debug(config);

      return config;
    });

    // Add interceptor to handle cached tokens and token expiration
    this.connection.interceptors.response.use(
      response => response,
      async error => {
        log.debug('BOOMI Connector, response interceptor: - error');
        log.debug(error);

        const originalRequest = error.config;

        log.debug('BOOMI Connector, response interceptor: - originalRequest');
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
              client_id: this.boomiAuth0ClientId,
              client_secret: this.boomiAuth0ClientSecret,
              audience: 'https://cochlear.com/drx'
            };

            const params = new URLSearchParams(payload);

            const {data} = await axios.post(this.tokenUrl, params.toString(), {
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            });

            log.debug('BOOMI Connector, response interceptor: - data');
            log.debug(data);

            this.token = data;

            // Store token in cache
            await this.cache.save(
              `${this.env}_drx-boomiToken`,
              JSON.stringify(this.token),
              7200
            );

            return this.connection(originalRequest);
          } catch (error) {
            log.debug(
              'BOOMI Connector, response interceptor: - get token error'
            );
            console.error(error.response.data);

            return Promise.reject(error);
          }
        }

        log.debug('BOOMI Connector, response interceptor: - final error');
        console.error(error.response.data);

        return Promise.reject(error);
      }
    );
  }

  async getToken() {
    log.debug('BOOMI Connector, getToken: - this.token');
    log.debug(this.token);

    if (this.token) {
      return this.token;
    }

    // Find token in cache
    const cachedToken = await this.cache.get(`${this.env}_drx-boomiToken`);

    log.debug('BOOMI Connector, getToken: - cachedToken');
    log.debug(cachedToken);

    if (cachedToken) {
      const parsedCachedToken = JSON.parse(cachedToken);

      log.debug('BOOMI Connector, getToken: - parsed cachedToken');
      log.debug(parsedCachedToken);

      return (this.token = parsedCachedToken);
    }

    try {
      const payload = {
        grant_type: 'client_credentials',
        client_id: this.boomiAuth0ClientId,
        client_secret: this.boomiAuth0ClientSecret,
        audience: 'https://cochlear.com/drx'
      };

      const reqParams = new URLSearchParams(payload);

      const {data} = await axios.post(this.tokenUrl, reqParams.toString(), {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      });

      log.debug('BOOMI Connector, getToken: data');
      log.debug(data);

      this.token = data;

      // Store token in cache
      await this.cache.save(
        `${this.env}_drx-boomiToken`,
        JSON.stringify(this.token),
        7200
      );

      return this.token;
    } catch (error) {
      log.debug('BOOMI Connector, getToken: - error');
      console.error(error.response.data);

      throw error;
    }
  }

  async searchClinics(reqParams) {
    try {
      log.debug('BOOMIConnector, searchClinics: -');
      log.debug(JSON.stringify(reqParams));

      console.time('BOOMI-searchClinics');
      const resp = await this.connection.post(
        `customer/providers/clinicList`,
        JSON.parse(reqParams.ReqData)
      );
      console.timeEnd('BOOMI-searchClinics');

      log.debug('BOOMIConnector, searchClinics: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, searchClinics: - error');
      log.debug(error.response.data);

      throw error;
    }
  }
}

module.exports = BOOMIConnector;

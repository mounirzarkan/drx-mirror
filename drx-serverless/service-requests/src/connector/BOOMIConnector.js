'use strict';

const axios = require('axios');
const {log} = require('../util/index.js');

class BOOMIConnector {
  constructor(params, accessToken) {
    this.token = null;
    this.tokenUrl = params.boomiOauthEndpoint;
    this.boomiAuth0ClientId = params.boomiAuth0ClientId;
    this.boomiAuth0ClientSecret = params.boomiAuth0ClientSecret;
    this.connection = axios.create({
      baseURL: params.boomiServiceEndpoint,
      headers: {
        'x-api-key': params.boomiAuth0ApiKey,
        'x-auth-token': accessToken
      }
    });
    this.env = params.env;
    this.cache = params.cache;

    // Add interceptor to inject Authorization header with Bearer token
    this.connection.interceptors.request.use(async (config) => {
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
      (response) => response,
      async (error) => {
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

      const params = new URLSearchParams(payload);

      const {data} = await axios.post(this.tokenUrl, params.toString(), {
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

      throw new Error(error);
    }
  }

  // API.SERVICE_REQUESTS
  async getServiceRequests(cochlearId, page) {
    try {
      log.debug('BOOMIConnector, getServiceRequests: - cochlearId');
      log.debug(cochlearId);

      log.debug('BOOMIConnector, getServiceRequests: - page');
      log.debug(page);

      console.time('BOOMI-getServiceRequests');
      const resp = await this.connection.get(
        `/customer/patients/v1/${cochlearId}/service-requests?page=${page}`
      );
      console.timeEnd('BOOMI-getServiceRequests');

      log.debug('BOOMIConnector, getServiceRequests: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getServiceRequests: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  // API.SERVICE_REQUEST
  async getServiceRequest(cochlearId, serviceRequestId) {
    try {
      log.debug('BOOMIConnector, getServiceRequest: - cochlearId');
      log.debug(cochlearId);

      log.debug('BOOMIConnector, getServiceRequest: - serviceRequestId');
      log.debug(serviceRequestId);

      console.time('BOOMI-getServiceRequest');
      const resp = await this.connection.get(
        `/customer/patients/v1/${cochlearId}/service-requests/${serviceRequestId}`
      );
      console.timeEnd('BOOMI-getServiceRequest');

      log.debug('BOOMIConnector, getServiceRequest: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getServiceRequest: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  // API.CREATE_CASE
  async createCase(payload, cochlearId) {
    try {
      log.debug('BOOMIConnector, createCase: - payload');
      log.debug(payload);

      log.debug('BOOMIConnector, createCase: - cochlearId');
      log.debug(cochlearId);

      console.time('BOOMI-createCase');
      const resp = await this.connection.post(
        `/customer/patients/v1/${cochlearId}/cases`,
        payload
      );
      console.timeEnd('BOOMI-createCase');

      log.debug('BOOMIConnector, createCase: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, createCase: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }
}

module.exports = BOOMIConnector;

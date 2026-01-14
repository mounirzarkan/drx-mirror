'use strict';

const axios = require('axios');
const log = require('../util/logUtil.js');

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
        console.error(error);
        console.error(error.response?.data);
        console.error(error.response?.status);

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
      console.error(error);
      console.error(error.response?.data);
      console.error(error.response?.status);

      throw new Error(error);
    }
  }

  // API.ORDERS
  async getOrdersList(cochlearId, page = 1) {
    try {
      log.debug('BOOMIConnector, getOrdersList: - cochlearId');
      log.debug(cochlearId);

      console.time('BOOMI-getOrdersList');
      const resp = await this.connection.get(
        `/customer/patients/v1/${cochlearId}/order-requests?page=${page}`
      );
      console.timeEnd('BOOMI-getOrdersList');

      log.debug('BOOMIConnector, getOrdersList: - resp.data');
      log.debug(resp.data);

      return resp.data.patientOrderRequest;
    } catch (error) {
      log.debug('BOOMI Connector, getOrdersList: - error');
      log.debug(error);

      throw new Error(error);
    }
  }

  // API.ORDERS
  async getOrderDetails(orderReqId, cochlearId) {
    try {
      log.debug('BOOMIConnector, getOrderDetails: - cochlearId');
      log.debug(cochlearId);

      log.debug('BOOMIConnector, getOrderDetails: - orderReqId');
      log.debug(orderReqId);

      console.time('BOOMI-getOrderDetails');
      const resp = await this.connection.get(
        `/customer/patients/v1/${cochlearId}/order-requests/${orderReqId}`
      );
      console.timeEnd('BOOMI-getOrderDetails');

      log.debug('BOOMIConnector, getOrderDetails: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getOrderDetails: - error');
      log.debug(error);

      throw new Error(error);
    }
  }
}

module.exports = BOOMIConnector;

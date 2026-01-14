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

  // API.PATIENT CONSENT (ocSMS)
  async getAccountConsent(cochlearId) {
    try {
      log.debug('BOOMIConnector, getPatientConsent: - cochlearId');
      log.debug(cochlearId);

      console.time('BOOMI-getPatientConsent');
      const resp = await this.connection.get(
        `/customer/patients/v1/${cochlearId}/operational-consents`
      );
      console.timeEnd('BOOMI-getPatientConsent');

      log.debug('BOOMIConnector, getPatientConsent: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getPatientConsent: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  async updateAccountConsent(cochlearId, payload) {
    try {
      log.debug('BOOMIConnector, updateAccountConsent: - cochlearId');
      log.debug(cochlearId);

      log.debug('BOOMIConnector, updateAccountConsent: - payload');
      log.debug(payload);

      console.time('BOOMI-updateAccountConsent');
      const resp = await this.connection.patch(
        `/customer/patients/v1/${cochlearId}/operational-consents`,
        payload
      );
      console.timeEnd('BOOMI-updateAccountConsent');

      log.debug('BOOMIConnector, updateAccountConsent: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, updateAccountConsent: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }
  // API.PATIENT
  async getPatient(cochlearId) {
    try {
      log.debug('BOOMIConnector, getPatient: - cochlearId');
      log.debug(cochlearId);

      console.time('BOOMI-getPatient');
      const resp = await this.connection.get(
        `customer/patients/v1/${cochlearId}`
      );
      console.timeEnd('BOOMI-getPatient');

      log.debug('BOOMIConnector, getPatient: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getPatient: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  // API.PATIENT
  async updateAccount(cochlearId, payload) {
    try {
      log.debug('BOOMIConnector, updateAccount: - cochlearId');
      log.debug(cochlearId);

      log.debug('BOOMIConnector, updateAccount: - payload');
      log.debug(payload);

      console.time('BOOMI-updateAccount');
      const resp = await this.connection.patch(
        `/customer/patients/v1/${cochlearId}`,
        payload
      );
      console.timeEnd('BOOMI-updateAccount');

      log.debug('BOOMIConnector, updateAccount: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, updateAccount: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  // API.PATIENT PATIENT RELATIONSHIP
  async getPatientRelationship(cochlearId) {
    try {
      log.debug('BOOMIConnector, getPatientRelationship: - cochlearId');
      log.debug(cochlearId);

      console.time('BOOMI-getPatientRelationship');
      const resp = await this.connection.get(
        `customer/patients/v1/${cochlearId}/patients`
      );
      console.timeEnd('BOOMI-getPatientRelationship');

      log.debug('BOOMIConnector, getPatientRelationship: - resp.data');
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getPatientRelationship: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  // API.PATIENT PATIENT RELATIONSHIP - dependent/recipient
  async getPatientRelationshipDependent(cochlearId) {
    try {
      log.debug(
        'BOOMIConnector, getPatientRelationship dependent: - cochlearId'
      );
      log.debug(cochlearId);

      console.time('BOOMI-getPatientRelationship dependent');
      const resp = await this.connection.get(
        `customer/patients/v1/${cochlearId}/patients?role=Dependent`
      );
      console.timeEnd('BOOMI-getPatientRelationship dependent');

      log.debug(
        'BOOMIConnector, getPatientRelationship dependent: - resp.data'
      );
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getPatientRelationship dependent: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }

  async getPatientOrganizationRelationship(cochlearId) {
    try {
      log.debug(
        'BOOMIConnector, getPatientOrganizationRelationship: - cochlearId'
      );
      log.debug(cochlearId);

      console.time('BOOMI-getPatientOrganizationRelationship');
      const resp = await this.connection.get(
        `/customer/patients/v1/${cochlearId}/organisations`
      );
      console.timeEnd('BOOMI-getPatientOrganizationRelationship');

      log.debug(
        'BOOMIConnector, getPatientOrganizationRelationship: - resp.data'
      );
      log.debug(resp.data);

      return resp.data;
    } catch (error) {
      log.debug('BOOMI Connector, getPatientOrganizationRelationship: - error');
      console.error(error.response.data);

      throw new Error(error);
    }
  }
}

module.exports = BOOMIConnector;

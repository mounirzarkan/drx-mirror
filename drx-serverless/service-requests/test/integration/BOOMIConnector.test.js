'use strict';

const chai = require('chai');
const sinon = require('sinon');
const {BOOMIConnector} = require('../../src/connector/index.js');

const {expect} = chai;

describe('SUITE: BOOMIConnector', () => {
  describe('getServiceRequests', () => {
    let boomiConnector;

    beforeEach(() => {
      const params = {
        boomiTokenEndpoint:
          'https://auth-sit.apigw.nonp.cochlear.cloud/oauth2/token',
        boomiServiceEndpoint: 'https://sit.api.cochlear.com/service/rest',
        boomiApiKeys:
          '{"service-request": "67e88238-3aa4-498a-b2e0-b0feba6bc023"}',
        env: 'sit',
        cache: {
          get: sinon.stub(),
          save: sinon.stub()
        },
        boomiClientId: '6t4bhk45dl6pq9is2nguqeuopl',
        boomiClientSecret: 'mpm9bkn8fk6rp220ps59koges4c6igkg5d6iej91biu4mtcnb5k'
      };
      const api = 'service-request';
      boomiConnector = new BOOMIConnector(params, api);
    });

    it('should make a get patient request to the correct endpoint with the correct headers and return the response data', async () => {
      const data = await boomiConnector.getServiceRequests(
        '198005035636309',
        1
      );

      console.log(data);
      expect(data).to.have.property('_meta');
      expect(data).to.have.property('patientServiceRequests');
      expect(data.patientServiceRequests).to.have.length(9);
    });
  });

  describe('getServiceRequest', () => {
    let boomiConnector;

    beforeEach(() => {
      const params = {
        boomiTokenEndpoint:
          'https://auth-sit.apigw.nonp.cochlear.cloud/oauth2/token',
        boomiServiceEndpoint: 'https://sit.api.cochlear.com/service/rest',
        boomiApiKeys:
          '{"service-request": "67e88238-3aa4-498a-b2e0-b0feba6bc023"}',
        env: 'sit',
        cache: {
          get: sinon.stub(),
          save: sinon.stub()
        },
        boomiClientId: '6t4bhk45dl6pq9is2nguqeuopl',
        boomiClientSecret: 'mpm9bkn8fk6rp220ps59koges4c6igkg5d6iej91biu4mtcnb5k'
      };
      const api = 'service-request';
      boomiConnector = new BOOMIConnector(params, api);
    });

    it('should make a get relationship request to the correct endpoint with the correct headers and return the response data', async () => {
      const data = await boomiConnector.getServiceRequest(
        '198005035636309',
        '380161'
      );

      expect(data).to.have.property('id');
      expect(data).to.have.property('status');
      expect(data).to.have.property('createdDate');
      expect(data).to.have.property('problemCode');
      expect(data).to.have.property('problemDescription');
      expect(data).to.have.property('shippingContact');
      expect(data).to.have.property('shippingAddress');
    });
  });
});

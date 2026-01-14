'use strict';

const chai = require('chai');
const sinon = require('sinon');
const {BOOMIConnector} = require('../../src/connector/index.js');

const {expect} = chai;

describe('SUITE: BOOMIConnector', () => {
  describe('getPatient', () => {
    let boomiConnector;

    beforeEach(() => {
      const params = {
        boomiTokenEndpoint:
          'https://auth-sit.apigw.nonp.cochlear.cloud/oauth2/token',
        boomiServiceEndpoint: 'https://sit.api.cochlear.com/service/rest',
        boomiApiKeys: '{"patient": "ea643673-655b-48d4-9054-876329f365f7"}',
        env: 'sit',
        cache: {
          get: sinon.stub(),
          save: sinon.stub()
        },
        boomiClientId: '6t4bhk45dl6pq9is2nguqeuopl',
        boomiClientSecret: 'mpm9bkn8fk6rp220ps59koges4c6igkg5d6iej91biu4mtcnb5k'
      };
      const api = 'patient';
      boomiConnector = new BOOMIConnector(params, api);
    });

    it('should make a get patient request to the correct endpoint with the correct headers and return the response data', async () => {
      const data = await boomiConnector.get('198005035636309');

      expect(data.cochlearId).equals('198005035636309');
      expect(data.cochlearId).to.have.length(15);
      expect(data).to.have.property('personas');
      expect(data).to.have.property('firstName');
      expect(data).to.have.property('lastName');
      expect(data).to.have.property('isDeceased');
    });
  });

  describe('getRelationships', () => {
    let boomiConnector;

    beforeEach(() => {
      const params = {
        boomiTokenEndpoint:
          'https://auth-sit.apigw.nonp.cochlear.cloud/oauth2/token',
        boomiServiceEndpoint: 'https://sit.api.cochlear.com/service/rest',
        boomiApiKeys:
          '{"relationship": "ee23a696-eecd-47ff-9398-285a68334e65"}',
        env: 'sit',
        cache: {
          get: sinon.stub(),
          save: sinon.stub()
        },
        boomiClientId: '6t4bhk45dl6pq9is2nguqeuopl',
        boomiClientSecret: 'mpm9bkn8fk6rp220ps59koges4c6igkg5d6iej91biu4mtcnb5k'
      };
      const api = 'relationship';
      boomiConnector = new BOOMIConnector(params, api);
    });

    it('should make a get relationship request to the correct endpoint with the correct headers and return the response data', async () => {
      const data = await boomiConnector.getRelationships('198005035636309', 1);

      expect(data).to.have.property('_meta');
      expect(data).to.have.property('patientPatientList');
      expect(data.patientPatientList).to.have.length(2);
    });
  });
});

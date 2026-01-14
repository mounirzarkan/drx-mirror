const sinon = require('sinon');
const {expect} = require('chai');
const {ResponseSimulation} = require('../../../src/simulation/index.js');

describe('ResponseSimulation', () => {
  let responseSimulation;

  beforeEach(() => {
    responseSimulation = new ResponseSimulation({
      errorUsers: {serviceRequests: {}}
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('SUITE: ResponseSimulation, matchingUser', () => {
    it('CASE: should return true if matching user exists', () => {
      responseSimulation.errorUsers.serviceRequests = {
        getServiceRequests: [{cid: '198005035636309'}]
      };

      const result = responseSimulation.matchingUser(
        '198005035636309',
        'getServiceRequests'
      );

      expect(result).to.be.true;
    });

    it('CASE: should return false if no matching user exists', () => {
      responseSimulation.errorUsers.serviceRequests = {
        getServiceRequests: [{cid: '111111111111111'}]
      };

      const result = responseSimulation.matchingUser(
        '198005035636309',
        'getServiceRequests'
      );

      expect(result).to.be.false;
    });
  });

  describe('SUITE: ResponseSimulation, simulate', () => {
    it('CASE: should throw an error if matching user exists', () => {
      sinon.stub(responseSimulation, 'matchingUser').returns(true);

      let error;
      try {
        responseSimulation.simulate('222222222222222', 'getServiceRequests');
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('Simulated Error');
    });
  });
});

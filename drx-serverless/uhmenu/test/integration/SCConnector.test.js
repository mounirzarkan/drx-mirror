'use strict';

const {expect} = require('chai');
const SCConnector = require('../../src/connector/SCConnector.js');
const sinon = require('sinon');

//https://cd.sit.cms.cochlear.cloud/api/cochlear
describe('SUITE: SCConnector', () => {
  describe('getUHmenu with isScHttpAgent = true', () => {
    let scReqSpy, scConnector, resp;
    before(async () => {
      const config = {
        _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
        _aws_secret: {
          sc_apikey: '%7B8802F4A2-D528-4422-BAE3-4373372DE1AD%7D',
          scp_env_username: 'devs',
          scp_env_password: 'greenavocado'
        },
        isScHttpAgent: true
      };
      scConnector = new SCConnector(
        config._scEndpoint,
        config._aws_secret,
        config.isScHttpAgent
      );
      scReqSpy = sinon.spy(scConnector.req, 'post');
      resp = await scConnector.getUHmenu('us', 'en');
    });
    after(() => {
      sinon.restore();
    });

    it('Expects to use httpsAgent when making a request', async () => {
      expect(scReqSpy.getCall(0).args[2].httpsAgent).to.be.an('object');
    });

    it('Expects response to contain item with id', async () => {
      expect(resp).with.property('item').with.property('id');
    });
  });

  describe('getUHmenu with isScHttpAgent = false', () => {
    let scReqSpy, scConnector, resp;
    before(async () => {
      const config = {
        _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
        _aws_secret: {
          sc_apikey: '%7B8802F4A2-D528-4422-BAE3-4373372DE1AD%7D',
          scp_env_username: 'devs',
          scp_env_password: 'greenavocado'
        },
        isScHttpAgent: false
      };
      scConnector = new SCConnector(
        config._scEndpoint,
        config._aws_secret,
        config.isScHttpAgent
      );
      scReqSpy = sinon.spy(scConnector.req, 'post');
      resp = await scConnector.getUHmenu('us', 'en');
    });
    after(() => {
      sinon.restore();
    });

    it('Expects not to use httpsAgent when making a request', async () => {
      expect(scReqSpy.getCall(0).args[2].httpsAgent).to.be.undefined;
    });

    it('Expects response to contain item with id', async () => {
      expect(resp).with.property('item').with.property('id');
    });
  });
});

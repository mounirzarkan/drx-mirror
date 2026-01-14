'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {BoomiOrdersService} = require('../../../src/service/index.js');
const connectors = require('../../../src/connector/index.js');

const boomiOrderHeadersStr = JSON.stringify(
  require('../../mock/boomiOrderHeaders.json').patientOrderRequest
);

const boomiOrderHeadersConvertStr = JSON.stringify(
  require('../../mock/boomiOrderHeadersConvert.json')
);

const boomiOrderLinesStr = JSON.stringify(
  require('../../mock/boomiOrderLines.json')
);

const boomiOrderLinesConvertStr = JSON.stringify(
  require('../../mock/boomiOrderLinesConvert.json')
);

const drxOrderHeadersStr = JSON.stringify(
  require('../../mock/drxOrderHeaders.json')
);

const drxOrderLinesStr = JSON.stringify(
  require('../../mock/drxOrderLines.json')
);

describe('SUITE: BoomiOrdersService - Unit Integration Test', () => {
  const configStr = JSON.stringify({
    scEndpoint: 'scEndpoint',
    sfHostname: 'sfHostname',
    sfClientId: 'sfClientId',
    sfUserName: 'sfUserName',
    secret: {
      scp_env_username: 'scp_env_username',
      scp_env_password: 'scp_env_password',
      sc_apikey: 'sc_apikey'
    },
    _env: 'DEV',
    privacyRulesSeconds: 7200,
    userSessionSeconds: 7200,
    userSessionPrefix: 'drx-dev-'
  });

  describe('SUITE: getOrderHeaders flow', () => {
    let ordersService = undefined;

    beforeEach(() => {
      const config = JSON.parse(configStr);
      ordersService = new BoomiOrdersService({
        ...config,
        cache: {
          getCustomKeyCache: function () {},
          saveCustomKeyInCache: function () {}
        },
        cacheRepo: {get: function () {}, save: function () {}}
      });
    });

    it('CASE: Requestor as carer calls getOrdersList - returns order headers for carer', async () => {
      const id = '259913555448708';
      const sub = '259913555448708';
      const days = '365';
      const countryCode = 'US';
      const page = '1';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() {}
          getToken() {
            return JSON.parse();
          }
          getOrdersList() {
            return JSON.parse(boomiOrderHeadersStr);
          }
          getOrderDetails() {
            return JSON.parse(boomiOrderLinesStr);
          }
        })()
      );

      sinon.stub(connectors, 'DRXConnector').returns(
        new (class {
          constructor() {}
          getToken() {
            return JSON.parse();
          }
          getOrderHeadersAdditionalInfo() {
            return JSON.parse(drxOrderHeadersStr);
          }
          getOrderLinesAdditionalInfo() {
            return JSON.parse(drxOrderLinesStr);
          }
        })()
      );

      const result = await ordersService.getOrdersList({
        id,
        sub,
        days,
        countryCode,
        page
      });

      const getOrderHeadersResult = JSON.parse(boomiOrderHeadersConvertStr);
      expect(result).to.deep.equal(getOrderHeadersResult);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: getOrderLines flow', () => {
    let ordersService = undefined;
    let cacheStub = undefined;

    beforeEach(() => {
      const config = JSON.parse(configStr);
      ordersService = new BoomiOrdersService({
        ...config,
        cache: {
          getCustomKeyCache: function () {},
          saveCustomKeyInCache: function () {}
        },
        cacheRepo: {get: function () {}, save: function () {}}
      });

      cacheStub = sinon.stub(ordersService.cache, 'getCustomKeyCache');
    });

    it('CASE: Requestor as carer calls getOrderDetails for order 76409149 - returns order details for carer', async () => {
      const orderId = '76409149';
      const id = '259913555448708';
      const sub = '259913555448708';
      const countryCode = 'US';

      const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';
      const USER_ORDER_INFO_KEY_PREFIX = 'orders-getOrderInfo-';

      cacheStub
        .withArgs(ordersService.userSessionPrefix, ACCESS_TOKEN_PREFIX + sub)
        .resolves('accessToken');
      cacheStub
        .withArgs(
          ordersService.userSessionPrefix,
          USER_ORDER_INFO_KEY_PREFIX + id
        )
        .resolves(drxOrderHeadersStr);

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() {}
          getToken() {
            return JSON.parse();
          }
          getOrdersList() {
            return JSON.parse(boomiOrderHeadersStr);
          }
          getOrderDetails() {
            return JSON.parse(boomiOrderLinesStr);
          }
        })()
      );

      sinon.stub(connectors, 'DRXConnector').returns(
        new (class {
          constructor() {}
          getToken() {
            return JSON.parse();
          }
          getOrderHeadersAdditionalInfo() {
            return JSON.parse(drxOrderHeadersStr);
          }
          getOrderLinesAdditionalInfo() {
            return JSON.parse(drxOrderLinesStr);
          }
        })()
      );

      const result = await ordersService.getOrderDetails({
        orderId,
        id,
        sub,
        countryCode
      });

      const getOrderLinesResult = JSON.parse(boomiOrderLinesConvertStr);
      expect(result).to.deep.equal(getOrderLinesResult);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});

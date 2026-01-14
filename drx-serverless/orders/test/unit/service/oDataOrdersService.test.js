'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {OdataOrdersService} = require('../../../src/service/index.js');
const connectors = require('../../../src/connector/index.js');

const odataOrderHeadersStr = JSON.stringify(
  require('../../mock/oDataOrderHeaders.json').value
);

const odataOrderHeadersConvertStr = JSON.stringify(
  require('../../mock/oDataOrderHeadersConvert.json')
);

const odataOrderLinesStr = JSON.stringify(
  require('../../mock/oDataOrderLines.json').value
);

const odataOrderLinesConvertStr = JSON.stringify(
  require('../../mock/oDataOrderLinesConvert.json')
);

const odataStatusStr = JSON.stringify(
  require('../../mock/oDataOrderStatus.json').value[0]
);

describe('SUITE: OdataOrdersService - Unit Integration Test', () => {
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
      ordersService = new OdataOrdersService({
        ...config
      });
    });

    it('CASE: Requestor as carer calls getOrdersList - returns order headers for carer', async () => {
      const id = '259913555448708';
      const sub = '259913555448708';
      const days = '365';
      const countryCode = 'US';
      const page = '1';

      const filterItems = [
        'HeaderId',
        'OrderNumber',
        'OnlineStoreOrderNumber',
        'OrderStatus',
        'OrderedDate',
        'LimitedOrderTaxesTotal',
        'LimitedOrderChargesTotal',
        'LimitedOrderLinesTotal',
        'OrderCurrency',
        'LimitedOrderTotal',
        'OrderType'
      ];

      sinon.stub(connectors, 'ODataConnector').returns(
        new (class {
          constructor() {}
          getToken() {
            return JSON.parse();
          }
          getOrdersList() {
            return JSON.parse(odataOrderHeadersStr);
          }
          getOrderDetails() {
            return JSON.parse(odataOrderLinesStr);
          }
          getOrderStatus() {
            return JSON.parse(odataStatusStr);
          }
        })()
      );

      const result = await ordersService.getOrdersList({
        id,
        sub,
        filterItems,
        days,
        countryCode,
        page
      });

      const getOrderHeadersResult = JSON.parse(odataOrderHeadersConvertStr);
      expect(result).to.deep.equal(getOrderHeadersResult);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: getOrderDetails flow', () => {
    let ordersService = undefined;

    beforeEach(() => {
      const config = JSON.parse(configStr);
      ordersService = new OdataOrdersService({
        ...config
      });
    });

    it('CASE: Requestor as carer calls getOrdersList - returns order headers for carer', async () => {
      const orderId = '68435181';
      const id = '28140850085970';
      const sub = '28140850085970';
      const countryCode = 'US';

      const filterItems = [
        'OrderLineNumber',
        'QuantityOrdered',
        'OrderedItem',
        'ItemDescription',
        'LineStatus',
        'UnitSellingPrice',
        'TotalSellingPrice',
        'OrderNumber',
        'HeaderId',
        'TaxAmount',
        'OrderType',
        'Hcpc'
      ];

      sinon.stub(connectors, 'ODataConnector').returns(
        new (class {
          constructor() {}
          getToken() {
            return JSON.parse();
          }
          getOrdersList() {
            return JSON.parse(odataOrderHeadersStr);
          }
          getOrderDetails() {
            return JSON.parse(odataOrderLinesStr);
          }
          getOrderStatus() {
            return JSON.parse(odataStatusStr);
          }
        })()
      );

      const result = await ordersService.getOrderDetails({
        orderId,
        id,
        sub,
        filterItems,
        countryCode
      });

      const getOrderLinesResult = JSON.parse(odataOrderLinesConvertStr);

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

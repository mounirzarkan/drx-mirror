'use strict';

const {expect} = require('chai');
const {sageResponseMapper} = require('../../../src/mapper/index.js');

describe('SUITE: convertOrderHeaders', function () {
  it('CASE: should convert order headers correctly', function () {
    const orders = [
      {
        id: '1',
        orderNumber: 'ON123',
        externalReferenceNumber: 'ERN123',
        status: 'Delivered',
        orderType: 'Online',
        orderDate: '2024-06-05T05:25:14Z',
        currency: 'USD',
        totalAmount: 100.5
      }
    ];
    const expected = [
      {
        HeaderId: 1,
        OrderNumber: 'ON123',
        OnlineStoreOrderNumber: 'ERN123',
        OrderStatus: 'Delivered',
        OrderType: 'Online',
        OrderedDate: '2024-06-06',
        LimitedOrderTaxesTotal: '0',
        LimitedOrderChargesTotal: '0',
        LimitedOrderLinesTotal: '0',
        OrderCurrency: 'USD',
        LimitedOrderTotal: '100.50'
      }
    ];

    const result = sageResponseMapper.convertOrderHeaders(orders);

    expect(result).to.deep.equal(expected);
  });
});

describe('SUITE: convertOrderLines', function () {
  it('CASE: should convert order lines correctly', function () {
    const order = {
      id: '1',
      orderNumber: 'ON123',
      orderLines: [
        {
          id: '1',
          orderNumber: 'ON123',
          itemNumber: '1',
          quantity: '2',
          partNumber: 'PN123',
          description: 'Item 1',
          status: 'Delivered',
          itemPrice: '50.25',
          itemAmount: '100.5',
          hcpc: 'HCPC123'
        }
      ]
    };
    const countryCode = 'US';
    const expected = {
      id: '1',
      orderNumber: 'ON123',
      orderLines: [
        {
          HeaderId: '1',
          OrderNumber: 'ON123',
          OrderLineNumber: '1',
          QuantityOrdered: '2',
          OrderedItem: 'PN123',
          ItemDescription: 'Item 1',
          LineStatus: 'Delivered',
          UnitSellingPrice: '50.25',
          TotalSellingPrice: '100.5',
          TaxAmount: '0',
          Hcpc: 'HCPC123'
        }
      ]
    };

    console.log(expected);
    const result = sageResponseMapper.convertOrderLines(order, countryCode);
    console.log(result);
    expect(result).to.deep.equal(expected);
  });
});

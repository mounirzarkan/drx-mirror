'use strict';

const {log, utils} = require('../util/index.js');

function convertOrderHeaders(orders) {
  let response = {};

  log.debug('convertOrderHeaders: - orders');
  log.debug(orders);

  if (orders) {
    response = orders.map((order) => {
      return {
        HeaderId: Number(order.id),
        OrderNumber: order.orderNumber,
        OnlineStoreOrderNumber:
          order.id === order.externalReferenceNumber
            ? null
            : order.externalReferenceNumber,
        OrderStatus: order.status,
        OrderType: order.orderType,
        OrderedDate: utils.formatDate(order.orderDate),
        LimitedOrderTaxesTotal: '0',
        LimitedOrderChargesTotal: '0',
        LimitedOrderLinesTotal: '0',
        OrderCurrency: order.currency,
        LimitedOrderTotal: order.totalAmount.toFixed(2)
      };
    });
  }

  log.debug('convertOrderHeaders: - response');
  log.debug(response);

  return response;
}

function convertOrderLines(order) {
  log.debug('convertOrderLines: - order');
  log.debug(order);

  let response = {...order};

  if (order) {
    response.orderLines = order.orderLines?.map((item) => {
      return {
        HeaderId: item.id,
        OrderNumber: item.orderNumber,
        OrderLineNumber: item.itemNumber,
        QuantityOrdered: item.quantity,
        OrderedItem: item.partNumber,
        ItemDescription: item.description,
        LineStatus: item.status,
        UnitSellingPrice: item.itemPrice,
        TotalSellingPrice: item.itemAmount,
        TaxAmount: '0',
        Hcpc: item.hcpc
      };
    });
  }

  log.debug('convertOrderLines: - response');
  log.debug(response);

  return response;
}

module.exports = {
  convertOrderHeaders,
  convertOrderLines
};

'use strict';

const _ = require('lodash');
const {utils, log} = require('../util/index.js');
const connectors = require('../connector/index.js');
const {odataResponseMapper} = require('../mapper/index.js');

class OdataOrdersService {
  constructor(config) {
    this.config = config;
  }

  async getOrdersList({id, filterItems, days, countryCode}) {
    log.debug('OrdersService - getOrdersList - countryCode: ');
    log.debug(countryCode);

    const {ODataConnector} = connectors;
    const odataConnector = new ODataConnector(this.config);

    let orderHeaders;

    try {
      if (countryCode === 'US') {
        orderHeaders = await odataConnector.getOrdersList(id, days);
        log.debug('OrdersService, getOrdersList orderHeaders');
        log.debug(orderHeaders);

        for (const header of orderHeaders) {
          const orderStatus = await odataConnector.getOrderStatus(
            header.HeaderId
          );
          log.debug('OrdersService, getOrdersList orderStatus');
          log.debug(orderStatus);

          header.OrderStatus = orderStatus?.OrderStatus || '';
        }
      } else {
        orderHeaders = await odataConnector.getOrdersList(id, days);
      }
    } catch (e) {
      log.error('OrdersService, getOrdersList error:');
      throw new Error(e);
    }

    log.debug('OrdersService - getOrdersList - orderHeaders: ');
    log.debug(orderHeaders);

    // convert response orderHeaders
    const convertedOrderHeaders =
      odataResponseMapper.convertOrderHeaders(orderHeaders);

    log.debug('OrdersService - getOrderHeaders - convertedOrderHeaders: ');
    log.debug(convertedOrderHeaders);

    // filter results based on request query filter param
    const filteredOrderHeaders = convertedOrderHeaders.map((header) => {
      return utils.filterObjProperties(header, filterItems);
    });

    log.debug('OrdersService - getOrderHeaders - filteredOrderHeaders: ');
    log.debug(filteredOrderHeaders);

    return filteredOrderHeaders.filter((foh) => !_.isEmpty(foh));
  }

  async getOrderDetails({orderId, id, filterItems, countryCode}) {
    log.debug('OrdersService - getOrderDetails - countryCode: ');
    log.debug(countryCode);

    const {ODataConnector} = connectors;
    const odataConnector = new ODataConnector(this.config);

    let orderLines;

    try {
      if (countryCode === 'US') {
        const [lines, status] = await Promise.all([
          odataConnector.getOrderDetails(orderId),
          odataConnector.getOrderStatus(orderId)
        ]);

        orderLines = {
          lines,
          status
        };
      } else {
        const lines = await odataConnector.getOrderDetails(orderId);

        orderLines = {
          lines
        };
      }
    } catch (e) {
      log.error('OrdersService, getOrderDetails error:');
      log.error(e);
      throw new Error(e);
    }

    log.debug('OrdersService - getOrderDetails - orderLines: ');
    log.debug(orderLines);

    // convert response orderlines
    const convertedOrderLines = odataResponseMapper.convertOrderLines(
      orderLines,
      countryCode
    );

    log.debug('OrdersService - getOrderLines - convertedOrderLines: ');
    log.debug(convertedOrderLines);

    const soldToPartyOrderLines = convertedOrderLines.orderLines.filter(
      (line) => {
        return line && line.SoldToPartyId === id;
      }
    );

    // remove SoldToPartyId from response
    soldToPartyOrderLines.forEach((line) => {
      delete line.SoldToPartyId;
    });

    log.debug('OrdersService - getOrderLines - soldToPartyOrderLines: ');
    log.debug(soldToPartyOrderLines);

    // filter results based on request query filter param
    const filteredOrderHeaders = convertedOrderLines.orderLines.map(
      (header) => {
        return utils.filterObjProperties(header, filterItems);
      }
    );

    log.debug('OrdersService - getOrderHeaders - filteredOrderHeaders: ');
    log.debug(filteredOrderHeaders);

    return {
      ...convertedOrderLines,
      orderLines: filteredOrderHeaders.filter((foh) => !_.isEmpty(foh))
    };
  }
}

module.exports = OdataOrdersService;

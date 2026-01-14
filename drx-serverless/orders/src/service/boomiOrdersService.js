'use strict';

const {log, utils} = require('../util/index.js');
const connectors = require('../connector/index.js');
const {sageResponseMapper} = require('../mapper/index');
const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';
const USER_ORDER_INFO_KEY_PREFIX = 'orders-getOrderInfo-';

class BoomiOrdersService {
  constructor(config) {
    this.config = config;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
    this.userSessionSeconds = config.userSessionSeconds;
  }

  async getOrdersList({id, sub, days, countryCode, page}) {
    log.debug('OrdersService - getOrdersList - countryCode: ');
    log.debug(countryCode);

    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + sub
    );

    log.debug('OrdersService, getOrdersList - accessToken:');
    log.debug(accessToken);

    const {BOOMIConnector, DRXConnector} = connectors;
    const booomiOrdersConnector = new BOOMIConnector(this.config, accessToken);
    const drxOrdersConnector = new DRXConnector(this.config);

    const initialOrderHeaders = await booomiOrdersConnector.getOrdersList(
      id,
      page
    );
    log.debug('OrdersService, getOrdersList initialOrderHeaders');
    log.debug(initialOrderHeaders);

    if (!initialOrderHeaders.length) {
      return [];
    }

    const headerIds = initialOrderHeaders.map((order) => order.id);
    log.debug('OrdersService, getOrdersList headerIds');
    log.debug(headerIds);

    const orderHeadersAdditionalInfo =
      await drxOrdersConnector.getOrderHeadersAdditionalInfo(headerIds);
    log.debug('OrdersService, getOrdersList orderHeadersAdditionalInfo');
    log.debug(orderHeadersAdditionalInfo);

    await this.cache.saveCustomKeyInCache(
      this.userSessionPrefix,
      USER_ORDER_INFO_KEY_PREFIX + id,
      orderHeadersAdditionalInfo,
      this.userSessionSeconds
    );

    let mergedOrderHeaders;

    log.debug('countryCode');
    log.debug(countryCode);

    if (countryCode === 'US' || countryCode === 'PR') {
      mergedOrderHeaders = utils.mergeOrderHeadersData(
        initialOrderHeaders, // source array
        orderHeadersAdditionalInfo, // lookup array
        ['orderStatus', 'orderType'] // properties to merge
      );
      log.debug('OrdersService, getOrdersList mergedOrderHeaders US');
      log.debug(mergedOrderHeaders);
    } else {
      mergedOrderHeaders = initialOrderHeaders;
      log.debug('OrdersService, getOrdersList mergedOrderHeaders EX-US');
      log.debug(mergedOrderHeaders);
    }

    const sortedOrderHeaders = utils.filterAndSortByDate(
      mergedOrderHeaders,
      days
    );
    log.debug('OrdersService, getOrdersList sortedOrderHeaders');
    log.debug(sortedOrderHeaders);

    const convertedOrderHeaders =
      sageResponseMapper.convertOrderHeaders(sortedOrderHeaders);
    log.debug('OrdersService - getOrdersList - convertedOrderHeaders: ');
    log.debug(convertedOrderHeaders);

    return convertedOrderHeaders;
  }

  async getOrderDetails({orderId, id, sub, countryCode}) {
    log.debug('OrdersService - getOrderDetails - countryCode: ');
    log.debug(countryCode);
    console.log(orderId, id, sub, countryCode);

    const [accessToken, orderHeadersAdditionalInfo] = await Promise.all([
      this.cache.getCustomKeyCache(
        this.userSessionPrefix,
        ACCESS_TOKEN_PREFIX + sub
      ),
      this.cache.getCustomKeyCache(
        this.userSessionPrefix,
        USER_ORDER_INFO_KEY_PREFIX + id
      )
    ]);

    log.debug('OrdersService, getOrdersList - accessToken:');
    log.debug(accessToken);

    log.debug('OrdersService, getOrdersList - orderHeadersAdditionalInfo:');
    log.debug(orderHeadersAdditionalInfo);

    const {BOOMIConnector, DRXConnector} = connectors;
    const booomiOrdersConnector = new BOOMIConnector(this.config, accessToken);
    const drxOrdersConnector = new DRXConnector(this.config);

    let orderLines;

    if (countryCode === 'US' || countryCode === 'PR') {
      const [lines, orderLinesAdditionalInfo] = await Promise.all([
        booomiOrdersConnector.getOrderDetails(orderId, id),
        drxOrdersConnector.getOrderLinesAdditionalInfo(orderId)
      ]);
      const orderLineData = {
        lines,
        linesInfo: orderLinesAdditionalInfo,
        headerInfo: JSON.parse(orderHeadersAdditionalInfo)
      };

      orderLines = utils.mergeOrderLinesData(orderLineData, countryCode);
    } else {
      const lines = await booomiOrdersConnector.getOrderDetails(orderId, id);
      const orderLineData = {
        lines
      };
      orderLines = utils.mergeOrderLinesData(orderLineData, countryCode);
    }

    log.debug('OrdersService - getOrderLines - orderLines: ');
    log.debug(orderLines);

    // convert response orderlines
    const convertedOrderLines =
      sageResponseMapper.convertOrderLines(orderLines);

    log.debug('OrdersService - getOrderLines - convertedOrderLines: ');
    log.debug(convertedOrderLines);

    return convertedOrderLines;
  }
}

module.exports = BoomiOrdersService;

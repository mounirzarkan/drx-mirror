'use strict';

const _ = require('lodash');
const OrdersService = require('../service/ordersService');
const {log} = require('../util/index');

const USER_ORDERS_LIST_KEY_PREFIX = 'orders-getOrdersList-';
const USER_ORDER_DETAILS_KEY_PREFIX = 'orders-getOrderDetails-';

class OrdersController {
  constructor(userFlow, config) {
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
    this.userSessionSeconds = config.userSessionSeconds;
    this.ordersService = new OrdersService(userFlow, config);
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  async getOrdersList({id, sub, filterItems, days, countryCode, page}) {
    const ordersStr = await this.getFromCache(
      this.userSessionPrefix,
      USER_ORDERS_LIST_KEY_PREFIX + sub + '-' + id
    );

    log.debug('OrdersController, getOrdersList - : cached entry');
    log.debug(ordersStr);

    if (!_.isEmpty(ordersStr) && !_.isEmpty(JSON.parse(ordersStr))) {
      return JSON.parse(ordersStr);
    }

    const ordersResponse = await this.ordersService.getOrdersList({
      id,
      sub,
      filterItems,
      days,
      countryCode,
      page
    });

    log.debug('OrdersController, getOrdersList - : ordersResponse');
    log.debug(ordersResponse);

    await this.saveInCache(
      this.userSessionPrefix,
      USER_ORDERS_LIST_KEY_PREFIX + sub + '-' + id,
      ordersResponse,
      this.userSessionSeconds
    );

    return ordersResponse;
  }

  async getOrderDetails({orderId, id, sub, filterItems, countryCode}) {
    const ordersStr = await this.getFromCache(
      this.userSessionPrefix,
      USER_ORDER_DETAILS_KEY_PREFIX + sub + '-' + id + '-' + orderId
    );

    log.debug('OrdersController, getOrderDetails - : cached entry');
    log.debug(ordersStr);

    if (!_.isEmpty(ordersStr) && !_.isEmpty(JSON.parse(ordersStr))) {
      return JSON.parse(ordersStr);
    }

    const ordersResponse = await this.ordersService.getOrderDetails({
      orderId,
      id,
      sub,
      filterItems,
      countryCode
    });

    log.debug('OrdersController, getOrderDetails - : ordersResponse');
    log.debug(ordersResponse);

    await this.saveInCache(
      this.userSessionPrefix,
      USER_ORDER_DETAILS_KEY_PREFIX + sub + '-' + id + '-' + orderId,
      ordersResponse,
      this.userSessionSeconds
    );

    return ordersResponse;
  }
}

module.exports = OrdersController;

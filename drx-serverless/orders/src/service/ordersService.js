'use strict';

const {USER_FLOW} = require('../util/index');

const BoomiOrdersService = require('./boomiOrdersService');
const OdataOrdersService = require('./odataOrdersService');

class OrdersService {
  constructor(userFlow, config) {
    this.config = config;
    this.ordersService = null;

    if (userFlow === USER_FLOW.DEFAULT) {
      this.ordersService = new OdataOrdersService(config);
    }

    if (userFlow === USER_FLOW.SAGE) {
      this.ordersService = new BoomiOrdersService(config);
    }
  }

  async getOrdersList(payload) {
    return await this.ordersService.getOrdersList(payload);
  }

  async getOrderDetails(payload) {
    return await this.ordersService.getOrderDetails(payload);
  }
}

module.exports = OrdersService;

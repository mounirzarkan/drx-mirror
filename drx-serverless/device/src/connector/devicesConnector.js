'use strict';

class DevicesConnector {
  constructor() {
    this.connector = undefined;
  }

  setConnector(connector) {
    this.connector = connector;
  }

  async getDeviceList(id) {
    return await this.connector.getDeviceList(id);
  }

  async getDevice(id, deviceId) {
    return await this.connector.getDevice(id, deviceId);
  }

  async getAccount(id) {
    return await this.connector.getAccount(id);
  }
}

module.exports = DevicesConnector;

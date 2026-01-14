'use strict';
const {DeviceService} = require('../service/index.js');

class DeviceController {
  constructor(userFlow, configuration, queryParams) {
    this.cache = configuration.cache;
    this.userSessionPrefix = configuration.userSessionPrefix;
    this.userSessionSeconds = configuration.userSessionSeconds;
    this.deviceService = new DeviceService(
      userFlow,
      configuration,
      queryParams
    );
  }

  async getDevicesList(configuration) {
    // get devices list
    const devicesListStr = await this.deviceService.getDeviceList(
      configuration.cochlearId,
      configuration.hasDeviceSupport,
      configuration.sub
    );

    return devicesListStr;
  }

  async getDevice(configuration) {
    // get device
    return await this.deviceService.getDevice(
      configuration.deviceId,
      configuration.cochlearId,
      configuration.sub
    );
  }
}
module.exports = DeviceController;

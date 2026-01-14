'use strict';

const {USER_FLOW} = require('../util/index.js');

const BoomiDeviceService = require('./boomiDeviceService');
const SFDeviceService = require('./sfDeviceService');

class DeviceService {
  constructor(userFlow, config, queryParams) {
    if (userFlow === USER_FLOW.DEFAULT) {
      this.deviceService = new SFDeviceService(config, queryParams);
    } else if (userFlow === USER_FLOW.SAGE) {
      this.deviceService = new BoomiDeviceService(config, queryParams);
    }
  }

  async getDeviceList(cochlearId, hasDeviceSupport, sub) {
    return await this.deviceService.getDeviceList(
      cochlearId,
      hasDeviceSupport,
      sub
    );
  }

  async getDevice(deviceId, cochlearId, sub) {
    return await this.deviceService.getDevice(deviceId, cochlearId, sub);
  }
}
module.exports = DeviceService;

'use strict';
const {isEmpty} = require('lodash');
const {log, utils} = require('../util/index.js');
const {sfMapper} = require('../mapper/index.js');
const connectors = require('../connector/index.js');
const SFIntegrationToken = require('../token/SFIntegrationToken.js');

const CACHE_DEVICE_KEY_PREFIX = 'getDeviceList-';
const CACHE_DEVICE_SINGLE_KEY_PREFIX = 'getDevice-';
const CACHE_SR_KEY_PREFIX = 'openSrDeviceList-';

class SFDeviceService {
  constructor(configuration, queryParams) {
    this.queryParams = queryParams;
    this.cache = configuration.cache;
    this.userSessionPrefix = configuration.userSessionPrefix;
    this.userSessionSeconds = configuration.userSessionSeconds;
    this.sfIntegrationToken = new SFIntegrationToken(configuration);
  }

  async getDeviceList(cochlearId, hasDeviceSupport, sub) {
    console.time('Redis-deviceListCache');
    const devicesListStr = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      CACHE_DEVICE_KEY_PREFIX + cochlearId
    );
    console.timeEnd('Redis-deviceListCache');

    if (!isEmpty(devicesListStr)) {
      log.debug('SFDeviceService, getDeviceList: - deviceList from cache');
      log.debug(devicesListStr);

      return this.processQueryParams(devicesListStr);
    }

    const token = await this.sfIntegrationToken.getCacheToken();

    log.debug('SFDeviceService, getDeviceList - : token');
    log.debug(token);

    log.debug('SFDeviceService, getDeviceList: - cochlearId');
    log.debug(cochlearId);

    log.debug('SFDeviceService, getDeviceList: - hasDeviceSupport');
    log.debug(hasDeviceSupport);

    const {SFConnector} = connectors;
    const sfConnector = new SFConnector(token);

    let devicesList = await sfConnector.getDeviceList(cochlearId);
    log.debug('SFDeviceService, getDeviceList: - devicesList from api');
    log.debug(devicesList);

    devicesList = sfMapper.convertDefaultResponse(
      devicesList,
      hasDeviceSupport
    );
    log.debug(
      'SFDeviceService, getDeviceList: - devicesList converted sf response'
    );
    log.debug(devicesList);

    // ToDo: refactor
    if (hasDeviceSupport) {
      let openSrList = await this.cache.getCustomKeyCache(
        this.userSessionPrefix,
        CACHE_SR_KEY_PREFIX + cochlearId
      );

      log.debug('SFDeviceService, getDeviceList: - openSrList from cache');
      log.debug(openSrList);

      if (openSrList && openSrList !== 'NONE') {
        this.checkOpenServiceRequest(
          devicesList.data.soundProcessors,
          openSrList
        );
        this.checkOpenServiceRequest(
          devicesList.data.soundProcessorsV2,
          openSrList
        );
      } else {
        const sfAccount = await sfConnector.getAccount(cochlearId);
        log.debug('SFDeviceService, getDeviceList: - sfAccount');
        log.debug(sfAccount);

        openSrList = this.getOpenSrDevices(sfAccount);
        log.debug('SFDeviceService, getDeviceList: - openSrList');
        log.debug(openSrList);

        if (openSrList) {
          this.checkOpenServiceRequest(
            devicesList.data.soundProcessors,
            openSrList
          );
          this.checkOpenServiceRequest(
            devicesList.data.soundProcessorsV2,
            openSrList
          );
          await this.cache.saveCustomKeyInCache(
            this.userSessionPrefix,
            CACHE_SR_KEY_PREFIX + cochlearId,
            openSrList,
            this.userSessionSeconds
          );
        } else {
          await this.cache.saveCustomKeyStringValueInCache(
            this.userSessionPrefix,
            CACHE_SR_KEY_PREFIX + cochlearId,
            'NONE',
            this.userSessionSeconds
          );
        }
      }
    }

    // ToDo: Investigate, sort is happening within handler - is this required?
    // devicesList.data.soundProcessors?.sort((a, b) =>
    //   parseInt(a.fittingDate, 10) < parseInt(b.fittingDate, 10) ? 1 : -1
    // );

    // devicesList.data.soundProcessors?.sort((a, b) => {
    //   if (a.isSupported && !b.isSupported) {
    //     return -1;
    //   } else if (!a.isSupported && b.isSupported) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });

    log.debug('SFDeviceService, getDeviceList: - devicesList final response');
    log.debug(devicesList);

    await this.cache.saveCustomKeyInCache(
      this.userSessionPrefix,
      CACHE_DEVICE_KEY_PREFIX + cochlearId,
      devicesList,
      this.userSessionSeconds
    );

    return this.processQueryParams(JSON.stringify(devicesList));
  }

  async getDevice(deviceId, cochlearId, sub) {
    const token = await this.sfIntegrationToken.getCacheToken();

    log.debug('SFDeviceService, getDeviceList - : token');
    log.debug(token);

    log.debug('SFDeviceService, getDevice: - deviceId');
    log.debug(deviceId);

    log.debug('SFDeviceService, getDevice: - cochlearId');
    log.debug(cochlearId);

    let devicesListStr;

    // For default flow retrieve from a separate key as we are using results of getDeviceList api call
    console.time('Redis-deviceListCache');
    devicesListStr = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      CACHE_DEVICE_KEY_PREFIX + cochlearId
    );
    console.timeEnd('Redis-deviceListCache');

    let devicesList;

    if (!isEmpty(devicesListStr)) {
      devicesList = JSON.parse(devicesListStr);

      log.debug('SFDeviceService, getDevice: - deviceList cached');
      log.debug(devicesList);
    } else {
      const {SFConnector} = connectors;
      const sfConnector = new SFConnector(token);
      devicesList = await sfConnector.getDevice(cochlearId, deviceId);

      log.debug('SFDeviceService, getDevice: - deviceList from api');
      log.debug(devicesList);

      await this.cache.saveCustomKeyInCache(
        this.userSessionPrefix,
        CACHE_DEVICE_SINGLE_KEY_PREFIX + cochlearId,
        devicesList,
        this.userSessionSeconds
      );
    }

    // Note: no conversion required as we filter devices that are already converted and in the cache after the getDeviceList api call
    let spRes, accRes, implRes;
    switch (true) {
      case Boolean(
        (spRes = utils.findDevice(devicesList, 'soundProcessorsV2', deviceId))
      ):
        log.debug(`${'soundProcessorsV2'}\n`, spRes);
        return spRes;

      case Boolean(
        (accRes = utils.findDevice(devicesList, 'accessories', deviceId))
      ):
        log.debug(`${'accessories'}\n`, accRes);
        return accRes;

      case Boolean(
        (implRes = utils.findDevice(devicesList, 'implant', deviceId))
      ):
        log.debug(`${'implant'}\n`, implRes);
        return implRes;

      default:
        return null;
    }
  }

  // ToDo: refactor, move out of service folder
  getOpenSrDevices(sfAccount) {
    let _openSrList = null;
    if (sfAccount && sfAccount.serviceRequests) {
      sfAccount.serviceRequests.map((device) => {
        if (device.serialNumber) {
          if (isEmpty(_openSrList)) {
            _openSrList = device.serialNumber;
          } else {
            _openSrList = _openSrList + ',' + device.serialNumber;
          }
        }
      });
    }

    log.debug('SFDeviceService, getOpenSrDevices: - _openSrList');
    log.debug(_openSrList);
    return _openSrList;
  }

  // ToDo: refactor, move out of service folder
  checkOpenServiceRequest(soundProcessors, openSrList) {
    log.debug('SFDeviceService, checkOpenServiceRequest: - soundProcessors');
    log.debug(soundProcessors);

    log.debug('SFDeviceService, checkOpenServiceRequest: - openSrList');
    log.debug(openSrList);

    if (!isEmpty(openSrList)) {
      const serialNumbers = openSrList.split(',');

      log.debug(
        'SFDeviceService, checkOpenServiceRequest: - openSr serialNumbers'
      );
      log.debug(serialNumbers);

      soundProcessors.forEach((data) => {
        log.debug(
          'SFDeviceService, checkOpenServiceRequest: - device serialNumber'
        );
        log.debug(data.serialNumber);
        if (serialNumbers.includes(data.serialNumber)) {
          log.debug('SFDeviceService, checkOpenServiceRequest: - has openSR');
          log.debug(data.serialNumber);

          data.hasOpenSR = true;
        }
      });
    }
  }

  processQueryParams(devicesListStr) {
    const {flatten, filterParams, sortParams, page} = this.queryParams;

    if (flatten) {
      // flatten list
      const ls = JSON.parse(devicesListStr).data;
      ls.soundProcessors = ls.soundProcessorsV2;
      delete ls.soundProcessorsV2;
      let flatList = utils.flattenList(ls);

      // filter list
      if (filterParams.filterField) {
        log.debug('do filter');
        flatList = utils.filterList(flatList, filterParams);
      }

      // sort list
      if (sortParams.sortField) {
        log.debug('do sort');
        log.debug(flatList);
        log.debug('sortParams');
        log.debug(sortParams);
        flatList = utils.sortList(flatList, sortParams);
        log.debug('flatList');
        log.debug(flatList);
      }

      // ToDo: pagination list
      if (page) {
        log.debug('add pagination');
        flatList = utils.paginateList(flatList, page);
        log.debug('pagination flatList');
        log.debug(flatList);
      }
      return JSON.stringify(flatList);
    } else {
      // original response - remove extra data when skipping flatten
      const dl = JSON.parse(devicesListStr);
      dl.data = {soundProcessors: dl.data.soundProcessors};
      devicesListStr = JSON.stringify(dl);

      log.debug('SFDeviceService: - processQueryParams (in else block)');
      log.debug(devicesListStr);
      return devicesListStr;
    }
  }
}

module.exports = SFDeviceService;

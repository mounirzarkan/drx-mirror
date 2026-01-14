'use strict';

const {log, utils} = require('../util/index.js');
const {isEmpty} = require('lodash');

const connectors = require('../connector/index.js');
const {sageMapper} = require('../mapper/index.js');

const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';
const CACHE_DEVICE_SINGLE_KEY_PREFIX = 'getDevice-';
const CACHE_DEVICE_KEY_PREFIX = 'getDeviceList-';

class BoomiDeviceService {
  constructor(configuration, queryParams) {
    log.debug('BoomiDeviceService, constructor - ');
    log.debug(configuration);
    log.debug(queryParams);
    this.queryParams = queryParams;
    this.configuration = configuration;
    this.cache = configuration.cache;
    this.userSessionPrefix = configuration.userSessionPrefix;
    this.userSessionSeconds = configuration.userSessionSeconds;
  }

  async getDeviceList(cochlearId, hasDeviceSupport, sub) {
    const correctedFilterValue =
      this.queryParams.filterParams.filterValue === 'Speech Processor'
        ? 'SoundProcessor'
        : this.queryParams.filterParams.filterValue;
    // SF defaults to page 0, Boomi defaults to 1. Add +1 for Boomi
    let queryParamsStr = this.queryParams.page
      ? `_page${parseInt(this.queryParams.page) + 1}`
      : `_page1`;
    queryParamsStr +=
      this.queryParams.filterParams.filterField && correctedFilterValue
        ? `_${this.queryParams.filterParams.filterField}${correctedFilterValue}`
        : '';

    console.time('Redis-deviceListCache');
    const devicesListStr = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      CACHE_DEVICE_KEY_PREFIX + sub + '-' + cochlearId + queryParamsStr
    );
    console.timeEnd('Redis-deviceListCache');

    if (!isEmpty(devicesListStr)) {
      log.debug('DeviceService, getDeviceList: - deviceList from cache');
      log.debug(devicesListStr);

      return this.processQueryParams(JSON.parse(devicesListStr));
    }

    log.debug('BoomiDeviceService, getDeviceList: - sub');
    log.debug(sub);

    log.debug('BoomiDeviceService, getDeviceList: - cochlearId');
    log.debug(cochlearId);

    log.debug('BoomiDeviceService, getDeviceList: - hasDeviceSupport');
    log.debug(hasDeviceSupport);

    log.debug('BoomiDeviceService, getDeviceList accessToken:');
    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + sub
    );
    log.debug(accessToken);

    const {BOOMIConnector} = connectors;
    const boomiDeviceConnector = new BOOMIConnector(
      this.configuration,
      accessToken
    );
    let devicesList = await boomiDeviceConnector.getDeviceList(
      cochlearId,
      this.queryParams
    );

    log.debug('BoomiDeviceService, getDeviceList: - devicesList from api');
    log.debug(devicesList);

    devicesList = sageMapper.convertSageListResponse(devicesList);

    log.debug(
      'BoomiDeviceService, getDeviceList: - devicesList converted boomi response'
    );
    log.debug(devicesList);

    await this.cache.saveCustomKeyInCache(
      this.userSessionPrefix,
      CACHE_DEVICE_KEY_PREFIX + sub + '-' + cochlearId + queryParamsStr,
      devicesList,
      this.userSessionSeconds
    );

    return this.processQueryParams(devicesList);
  }

  async getDevice(deviceId, cochlearId, sub) {
    log.debug('BoomiDeviceService, getDevice: - sub');
    log.debug(sub);

    log.debug('BoomiDeviceService, getDevice: - deviceId');
    log.debug(deviceId);

    log.debug('BoomiDeviceService, getDevice: - cochlearId');
    log.debug(cochlearId);

    let deviceDetailStr;

    console.time('Redis-deviceDetailCache');
    deviceDetailStr = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      CACHE_DEVICE_SINGLE_KEY_PREFIX + sub + '-' + cochlearId + '-' + deviceId
    );
    console.timeEnd('Redis-deviceDetailCache');

    let deviceDetail;

    if (!isEmpty(deviceDetailStr)) {
      deviceDetail = JSON.parse(deviceDetailStr);

      log.debug('BoomiDeviceService, getDevice: - deviceDetailCache cached');
      log.debug(deviceDetail);
      deviceDetail = sageMapper.convertSageDetailResponse(deviceDetail);
      return deviceDetail;
    }

    log.debug('BoomiDeviceService, getDevice accessToken:');
    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + sub
    );
    log.debug(accessToken);

    const {BOOMIConnector} = connectors;
    const boomiDeviceConnector = new BOOMIConnector(
      this.configuration,
      accessToken
    );

    deviceDetail = await boomiDeviceConnector.getDevice(cochlearId, deviceId);
    log.debug('BoomiDeviceService, getDevice: - getDevice from api');
    log.debug(deviceDetail);

    await this.cache.saveCustomKeyInCache(
      this.userSessionPrefix,
      CACHE_DEVICE_SINGLE_KEY_PREFIX + sub + '-' + cochlearId + '-' + deviceId,
      deviceDetail,
      this.userSessionSeconds
    );
    deviceDetail = sageMapper.convertSageDetailResponse(deviceDetail);
    return deviceDetail;
  }

  processQueryParams(devicesList) {
    const {sortParams} = this.queryParams;

    let sortList = devicesList;
    // sort list
    if (sortParams.sortField) {
      log.debug('do sort');
      log.debug(sortList);
      log.debug('sortParams');
      log.debug(sortParams);
      sortList = utils.sortList(sortList, sortParams);
      log.debug('sortList');
      log.debug(sortList);
    }

    return JSON.stringify(sortList);
  }
}

module.exports = BoomiDeviceService;

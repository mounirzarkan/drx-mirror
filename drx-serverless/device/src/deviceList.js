'use strict';

const {isEmpty, isNil} = require('lodash');
const HashMap = require('hashmap');
const {DataTransform: convertor} = require('node-json-transform');
const {
  loginConnect,
  getToken,
  getDevicesList,
  getAccount
} = require('./connector/SFConnector');
const {getSFIntegrationCreds} = require('./util/utils');
const {convert: colorConvert} = require('./util/colorConvert');
const log = require('./util/logUtil');
const {EquipmentConversion} = require('./conversion/sfEquipmentConversion');

async function getList(cache, params) {
  const OPENSR_SESSION_KEY =
    params.userSessionPrefix + 'openSrDeviceList-' + params.cochlear_id;
  console.time('Redis-deviceListCache');
  let devicesListStr = await cache.get(params.userSessionKey);
  console.timeEnd('Redis-deviceListCache');

  //get list from cache

  if (!isEmpty(devicesListStr)) {
    log.debug('hit cache!!');
    log.debug(devicesListStr);
    return devicesListStr;
  }

  //get list from SF
  const integrationToken = await cache.get(params.redisTokenKey);
  let token;
  if (isEmpty(integrationToken)) {
    const sf_integration_credentials = getSFIntegrationCreds(
      params.sf_hostname,
      params.sf_clientId,
      params.sf_userName,
      params.sf_secretStr
    );

    const connect = loginConnect(sf_integration_credentials);
    token = await getToken(connect, sf_integration_credentials);
    await cache.save(
      params.redisTokenKey,
      JSON.stringify(token),
      params.tokenSessionSeconds
    );
  } else {
    token = JSON.parse(integrationToken);
  }
  log.debug('before getDevicesList');
  let devicesList = await getDevicesList(params.cochlear_id, token);
  log.debug('sf getDevicesList');
  log.debug(devicesList);
  //convert SF contract to API contract
  devicesList = convertResponse(devicesList, params);

  log.debug('sf convertResponse');
  log.debug(devicesList);

  //default sort
  devicesList.data.soundProcessors.sort((a, b) =>
    parseInt(a.fittingDate, 10) < parseInt(b.fittingDate, 10) ? 1 : -1
  );
  devicesList.data.soundProcessors.sort((a, b) => {
    if (a.isSupported && !b.isSupported) {
      return -1;
    } else if (!a.isSupported && b.isSupported) {
      return 1;
    } else {
      return 0;
    }
  });

  log.debug('params.hasDeviceSupport');
  log.debug(params.hasDeviceSupport);
  //add warranty data
  if (params.hasDeviceSupport) {
    // TODO refactor below
    let openSrList = await cache.get(OPENSR_SESSION_KEY);
    log.debug('openSrList');
    log.debug(openSrList);
    if (openSrList) {
      if ('NONE' !== openSrList) {
        checkOpenServiceRequest(devicesList.data.soundProcessors, openSrList);
        checkOpenServiceRequest(devicesList.data.soundProcessorsV2, openSrList);
      }
    } else {
      const sfAccount = await getAccount(params.cochlear_id, token);
      log.debug('sfAccount');
      log.debug(sfAccount);
      openSrList = getOpenSrDevices(sfAccount);
      log.debug('openSrList');
      log.debug(openSrList);
      if (openSrList) {
        checkOpenServiceRequest(devicesList.data.soundProcessors, openSrList);
        checkOpenServiceRequest(devicesList.data.soundProcessorsV2, openSrList);
        await cache.save(
          OPENSR_SESSION_KEY,
          openSrList,
          params.userSessionSeconds
        );
      } else {
        await cache.save(OPENSR_SESSION_KEY, 'NONE', params.userSessionSeconds);
      }
    }
  }

  devicesListStr = JSON.stringify(devicesList);

  //save full list in cache
  await cache.save(
    params.userSessionKey,
    devicesListStr,
    params.userSessionSeconds
  );

  return devicesListStr;
}

async function getDevice(cache, params) {
  let deviceList;
  console.time('Redis-deviceListCache');
  const devicesListStr = await cache.get(params.userSessionKey);
  console.timeEnd('Redis-deviceListCache');
  if (!isEmpty(devicesListStr)) {
    deviceList = JSON.parse(devicesListStr);
    log.debug('hit cache!!');
    log.debug(deviceList);

    log.debug('params.deviceId!!');
    log.debug(params.deviceId);
  } else {
    deviceList = await getList(cache, params);
  }
  const spRes =
    deviceList.data &&
    deviceList.data.soundProcessorsV2 &&
    deviceList.data.soundProcessorsV2.find(function (device) {
      return device.id === params.deviceId;
    });

  log.debug('spRes!!');

  if (spRes) {
    log.debug(spRes);
    return spRes;
  }
  const accRes =
    deviceList.data &&
    deviceList.data.accessories &&
    deviceList.data.accessories.find(function (device) {
      return device.id === params.deviceId;
    });
  if (accRes) {
    log.debug('accRes / remote accessory');
    log.debug(accRes);
    return accRes;
  }

  const implRes =
    deviceList.data &&
    deviceList.data.implant &&
    deviceList.data.implant.find(function (device) {
      return device.id === params.deviceId;
    });
  if (implRes) {
    log.debug('implRes');
    log.debug(implRes);
    return implRes;
  }
}

function getOpenSrDevices(sfAccount) {
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
  return _openSrList;
}

function checkOpenServiceRequest(soundProcessors, openSrList) {
  if (!isEmpty(openSrList)) {
    const serialNumbers = openSrList.split(',');
    log.debug('serialNumbers');
    log.debug(serialNumbers);
    log.debug('soundProcessors');
    log.debug(soundProcessors);
    soundProcessors.map((data) => {
      log.debug(data.serialNumber);
      if (serialNumbers.includes(data.serialNumber)) {
        log.debug('has openSR: ');
        log.debug(data.serialNumber);
        data.hasOpenSR = true;
      }
    });
  }
}

function convertResponse(sfResponse, params) {
  const equipmentList = new EquipmentConversion(params.hasDeviceSupport);
  const equipmentData = equipmentList.convertClassic(sfResponse.data);

  const apiData = convertProcessor(sfResponse.data);
  const warrantyDataMap = getWarrantyDateMap(sfResponse.data.contracts);
  for (const processor of apiData) {
    if (warrantyDataMap.has(processor.id)) {
      processor.underWarranty = true;
      processor.latestWarrantyDate = warrantyDataMap.get(processor.id);
    }
    processor.hasOpenSR = false;
  }
  return {
    success: true,
    data: {
      ...equipmentData,
      soundProcessors: apiData
    }
  };
}

function filterList(list, filterParams) {
  list = list.filter(
    (x) =>
      x[filterParams.filterField].toLowerCase() ===
      filterParams.filterValue.toLowerCase()
  );
  return list;
}

function paginateList(list, page, pagesize = 20) {
  const start = page * pagesize;
  let end = start + pagesize;

  if (list.length < end - 2) end = list.length;

  if (list.length < start - 2) {
    list = [];
  }

  list = list.slice(start, end);

  return list;
}

function sortList(list, sortParams) {
  const key = sortParams.sortField;
  const sortedList = [...list];

  // end of list for null or undefined values.
  const nils = sortedList.filter((x) => isNil(x[sortParams.sortField]));
  const values = sortedList.filter((x) => !isNil(x[sortParams.sortField]));

  if (sortParams.sortField) {
    values.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  if (sortParams.sortOrder.toLowerCase() === 'desc') {
    values.reverse();
  }

  return [...values, ...nils];
}

function flattenList(list) {
  var ls = [];

  for (const [key, value] of Object.entries(list)) {
    if (key !== 'contracts') {
      value.forEach((row) => {
        row.type = key;
        ls.push(row);
      });
    }
  }

  return ls;
}

function convertProcessor(sfData) {
  const map = {
    list: 'soundProcessors',
    item: {
      partNumber: 'product.partNumber',
      serialNumber: 'serialNumber',
      productName: 'productName',
      productFamily: 'productFamily',
      productDescription: 'product.description',
      fittingDate: 'fittingDate',
      earSide: 'earSide',
      deviceType: 'deviceType',
      deviceStatus: 'deviceStatus',
      customerFacingName: 'customerFacingName',
      colour: ['product.modelNumber', 'product.description'],
      id: 'id',
      underWarranty: '',
      isSupported: '',
      latestWarrantyDate: ''
    },
    operate: [
      {
        run: function () {
          return false;
        },
        on: 'underWarranty'
      },
      {
        run: () => {
          return null;
        },
        on: 'latestWarrantyDate'
      }
    ],
    each: function (item) {
      if (
        item.customerFacingName === 'Nucleus 6' ||
        item.customerFacingName === 'Nucleus 7' ||
        item.customerFacingName === 'Nucleus 8' ||
        item.customerFacingName === 'Kanso'
      ) {
        item.isSupported = true;
      } else {
        item.isSupported = false;
      }
      item.colour = colorConvert(item.colour);
    }
  };
  return convertor(sfData, map).transform();
}

function getWarrantyDateMap(contracts) {
  const map = new HashMap();
  const now = new Date().setHours(0, 0, 0, 0);

  const warrantyContracts = contracts.filter(
    ({coverageStatus} = {}) =>
      coverageStatus !== 'EXPIRED' &&
      coverageStatus !== 'CANCELLED' &&
      coverageStatus !== 'TERMINATED'
  );
  for (const contract of warrantyContracts) {
    const startDate = contract.startDate;
    const expirationDate = contract.expirationDate;
    const terminatedDate = contract.terminatedDate;
    let warrantyDate = undefined;

    if (
      new Date(startDate).setHours(0, 0, 0, 0) <= now &&
      new Date(expirationDate).setHours(0, 0, 0, 0) >= now
    ) {
      if (isNil(terminatedDate)) {
        warrantyDate = expirationDate;
        // map.set(contract.installBaseId, expirationDate);
      } else {
        if (new Date(terminatedDate).setHours(0, 0, 0, 0) >= now) {
          // map.set(contract.installBaseId, terminatedDate);
          warrantyDate = terminatedDate;
        }
      }
    }
    if (!isNil(warrantyDate)) {
      const baseId = contract.installBaseId;
      const oldWarrantyDate = map.get(baseId);
      if (isNil(oldWarrantyDate)) {
        map.set(baseId, warrantyDate);
      } else {
        if (oldWarrantyDate < warrantyDate) {
          map.set(baseId, warrantyDate);
        }
      }
      map.keys().forEach((key) => log.debug('key', key));
    }
  }
  return map;
}

module.exports = {
  getList,
  getDevice,
  flattenList,
  filterList,
  sortList,
  paginateList,
  getWarrantyDateMap,
  convertProcessor,
  convertResponse,
  checkOpenServiceRequest
};

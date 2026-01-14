'use strict';
const {isNil} = require('lodash');
const HashMap = require('hashmap');
const {DataTransform: convertor} = require('node-json-transform');
const {log, colorConvert} = require('../util/index.js');
const {EquipmentConversion} = require('../conversion');

function _getWarrantyDateMap(contracts) {
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

function _convertProcessor(sfData) {
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

// convert the salesforce classic device list response
function convertDefaultResponse(sfResponse) {
  log.debug('DeviceService, convertResponse: - sfResponse');
  log.debug(sfResponse);

  const equipmentData = new EquipmentConversion().convertClassic(
    sfResponse.data
  );
  log.debug('DeviceService, convertResponse: - equipmentData');
  log.debug(equipmentData);

  const apiData = _convertProcessor(sfResponse.data);
  log.debug('DeviceService, convertResponse: - apiData');
  log.debug(apiData);

  const warrantyDataMap = _getWarrantyDateMap(sfResponse.data.contracts);
  log.debug('DeviceService, convertResponse: - warrantyDataMap');
  log.debug(warrantyDataMap);

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

module.exports = {convertDefaultResponse};

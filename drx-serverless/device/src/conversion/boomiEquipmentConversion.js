'use strict';

const log = require('../util/logUtil.js');

// based on https://cltd-confluence.cochlear.com/pages/viewpage.action?pageId=344737376
class BOOMIEquipmentConversion {
  constructor() {}

  getLatestEntitlement(entitlements) {
    if (!entitlements || entitlements.length === 0) {
      return {};
    }
    return entitlements.reduce((a, b) => {
      return new Date(a.enddate) > new Date(b.enddate) ? a : b;
    });
  }

  handleIsSupportedStatus(asset) {
    if (asset.device.product.customerFacingName) {
      const supportedProducts = [
        'Nucleus 8',
        'N8',
        'N7',
        'N7 SE',
        'N7 S',
        'Kanso 2',
        'Kanso',
        'Nucleus 6',
        'Nucleus 7',
        'Nucleus 7 SE',
        'Nucleus 7 S'
      ];
      return supportedProducts.some((product) =>
        asset.device.product.customerFacingName.includes(product)
      );
    }
    return false;
  }

  handleType(type) {
    if (type.includes('Accessory') || type.includes('Remote Assistant')) {
      return 'accessories';
    } else if (type.includes('Sound Processor')) {
      return 'soundProcessors';
    } else if (type.includes('Implant')) {
      return 'implant';
    } else {
      return '';
    }
  }

  convertEquipmentList(data) {
    let response = [];

    log.debug('BOOMIEquipmentConversion, convertEquipmentList: - data');
    log.debug(data);

    if (data) {
      response = data.patientAsset
        ?.filter((asset) => asset.status !== 'Return Received')
        ?.map((asset) => {
        const entitlements =
          asset.entitlements?.filter(
            (e) => e.name === 'Faulty or Damaged Device Replacement'
          ) || [];

        const latestEntitlement = this.getLatestEntitlement(entitlements);

        const entitlementsContract = [];

        asset.entitlements &&
          asset.entitlements.map((e) =>
            entitlementsContract.push({
              end: new Date(e.enddate).getTime(),
              description: e.name
            })
          );

        const assetStartDateTimestamp = new Date(asset.startDate).getTime();

        const latestEntitlementEndDateTimestamp = new Date(
          latestEntitlement.enddate
        ).getTime();

        const underWarranty = latestEntitlement
          ? latestEntitlementEndDateTimestamp > Date.now()
          : false;

        const hasActiveOrExpiredEntitlements = entitlementsContract.length > 0;

        const returnObj = {
          serialNumber: asset.device.serialNumber,
          productName: asset.device.product.name,
          productFamily: '',
          partNumber: asset.device.product.partNumber,
          productId: asset.device.product.id,
          productDescription: asset.device.product.description,
          id: asset.id,
          deviceType: asset.device.product.productType,
          deviceStatus: asset.status,
          customerFacingName: asset.device.product.customerFacingName,
          modelNumber: asset.device.product.name,
          classDeviceType: asset.device.product.productType,
          underWarranty: underWarranty,
          earSide: asset.earSide,
          purchaseDate: assetStartDateTimestamp,
          hasOpenSR: asset.hasOpenSR,
          isSupported: this.handleIsSupportedStatus(asset),
          type: this.handleType(asset.device.product.productType)
        };

        if (
          underWarranty ||
          (!underWarranty && hasActiveOrExpiredEntitlements)
        ) {
          Object.assign(returnObj, {
            latestWarrantyDate: latestEntitlement
              ? latestEntitlementEndDateTimestamp
              : '',
            warrantyDescription: latestEntitlement
              ? latestEntitlement.name
              : '',
            contracts: entitlementsContract
          });
        }

        asset.device.product.productType === 'Implant' &&
          Object.assign(returnObj, {surgeryDate: assetStartDateTimestamp});
        asset.device.product.productType === 'Accessory' &&
          Object.assign(returnObj, {
            accessoryType: asset.device.product.accessoryType
          }); // TODO filed for ticket
        asset.device.product.productType === 'Sound Processor' &&
          Object.assign(returnObj, {colour: ''}); //sound processor only, not being processed in BOOMI
        asset.device.product.productType === 'Sound Processor' &&
          Object.assign(returnObj, {modelColor: ''}); //sound processor only, not being processed in BOOMI

        if (asset.device.product.productType !== 'Accessory') {
          returnObj.fittingDate = assetStartDateTimestamp;
        }

        return returnObj;
      });
    }

    log.debug('BOOMIEquipmentConversion, convertEquipmentList: - response');
    log.debug(response);

    return response;
  }

  convertEquipment(data) {
    const response = {};

    log.debug('BOOMIEquipmentConversion, convertEquipment: - data');
    log.debug(data);

    if (data) {
      const latestEntitlement = this.getLatestEntitlement(
        data.patientAsset.entitlements
      );

      const entitlementsContract = [];

      data.patientAsset.entitlements &&
        data.patientAsset.entitlements.map((e) =>
          entitlementsContract.push({
            end: new Date(e.endDate).getTime(),
            description: e.name
          })
        );

      const assetStartDateTimestamp = new Date(
        data.patientAsset.startDate
      ).getTime();

      const latestEntitlementEndDateTimestamp = new Date(
        latestEntitlement.endDate
      ).getTime();

      const underWarranty = latestEntitlementEndDateTimestamp > Date.now();

      const hasActiveOrExpiredEntitlements = entitlementsContract.length > 0;

      const returnObj = {
        serialNumber: data.patientAsset.device.serialNumber,
        productName: data.patientAsset.device.product.name,
        productFamily: '',
        partNumber: data.patientAsset.device.product.partNumber,
        productId: data.patientAsset.device.product.id,
        productDescription: data.patientAsset.device.product.description,
        id: data.patientAsset.id,
        deviceType: data.patientAsset.device.product.type,
        deviceStatus: data.patientAsset.status,
        customerFacingName: data.patientAsset.device.product.customerFacingName,
        modelNumber: data.patientAsset.device.product.name,
        classDeviceType: data.patientAsset.device.product.type,
        underWarranty: underWarranty,
        earSide: data.patientAsset.earSide,
        purchaseDate: assetStartDateTimestamp,
        hasOpenSR: data.patientAsset.hasOpenSR,
        isSupported: this.handleIsSupportedStatus(data.patientAsset),
        type: this.handleType(data.patientAsset.device.product.type)
      };

      if (underWarranty || (!underWarranty && hasActiveOrExpiredEntitlements)) {
        Object.assign(returnObj, {
          latestWarrantyDate: latestEntitlement
            ? latestEntitlementEndDateTimestamp
            : '',
          warrantyDescription: latestEntitlement ? latestEntitlement.name : '',
          contracts: entitlementsContract
        });
      }

      data.patientAsset.device.product.type === 'Implant' &&
        Object.assign(returnObj, {surgeryDate: assetStartDateTimestamp});
      data.patientAsset.device.product.type === 'Accessory' &&
        Object.assign(returnObj, {
          accessoryType: data.patientAsset.device.product.accessoryType
        }); // TODO filed for ticket
      data.patientAsset.device.product.type === 'Sound Processor' &&
        Object.assign(returnObj, {colour: ''}); //sound processor only, not being processed in BOOMI
      data.patientAsset.device.product.type === 'Sound Processor' &&
        Object.assign(returnObj, {modelColor: ''}); //sound processor only, not being processed in BOOMI

      if (data.patientAsset.device.product.type !== 'Accessory') {
        returnObj.fittingDate = assetStartDateTimestamp;
      }

      return returnObj;
    }

    log.debug('BOOMIEquipmentConversion, convertEquipment: - response');
    log.debug(response);

    return response;
  }
}

module.exports = BOOMIEquipmentConversion;

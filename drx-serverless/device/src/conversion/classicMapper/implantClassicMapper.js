'use strict';
const {DataTransform: convertor} = require('node-json-transform');

function implantClassicMapper(sfData) {
  const map = {
    list: 'implants',
    item: {
      serialNumber: 'serialNumber',
      productName: 'productName',
      productFamily: 'productFamily',
      partNumber: 'product.partNumber',
      productId: 'name',
      productDescription: 'product.description',
      id: 'id',
      deviceType: 'deviceType',
      deviceStatus: 'deviceStatus',
      customerFacingName: 'customerFacingName',
      classDeviceType: 'deviceType',
      surgeryDate: 'surgeryDate',
      earSide: 'earSide',
      purchaseDate: 'surgeryDate',
      modelNumber: 'product.modelNumber',
      rawColor: 'colour',
      latestWarrantyDate: null
    },
    operate: [
      {
        run: () => null,
        on: 'latestWarrantyDate'
      },
      {
        run: () => null,
        on: 'warrantyDescription'
      },
      {
        run: () => [],
        on: 'contracts'
      }
    ]
  };
  const implant = convertor(sfData, map).transform();
  //return implant.filter(({serialNumber}) => serialNumber !== null);
  return implant;
}

module.exports = {implantClassicMapper};

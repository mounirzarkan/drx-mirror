'use strict';
const {DataTransform: convertor} = require('node-json-transform');

function soundProcessorClassicMapper(sfData) {
  const map = {
    list: 'soundProcessors',
    item: {
      productId: 'name',
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
      modelColor: ['product.modelNumber', 'product.description'],
      id: 'id',
      purchaseDate: 'fittingDate',
      modelNumber: 'product.modelNumber',
      colour: 'colour',
      classDeviceType: 'deviceType'
    }
  };
  const soundProcessor = convertor(sfData, map).transform();
  //return soundProcessor.filter(({serialNumber}) => serialNumber !== null);
  return soundProcessor;
}

module.exports = {soundProcessorClassicMapper};

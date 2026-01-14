'use strict';
const {DataTransform: convertor} = require('node-json-transform');

function accessoryClassicMapper(property, sfData) {
  // property for 'accessories' & 'remoteAssistants' use the same mappings
  const map = {
    list: property,
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
      customerFacingName: 'name',

      earSide: 'earSide',
      purchaseDate: 'fittingDate',
      modelNumber: 'product.modelNumber',
      classDeviceType: 'deviceType',
      accessoryType: 'accessoryType'
    },
    operate: [
      {
        run: () => {
          return 'Accessory';
        },
        on: 'deviceType'
      }
    ]
  };

  const result = convertor(sfData, map).transform();
  //return result.filter(({serialNumber}) => serialNumber !== null);
  return result;
}

module.exports = {
  // set identifier property to accessories
  accessoryClassicMapper: accessoryClassicMapper.bind(undefined, 'accessories'),
  // set identifier property to remoteAssistants
  remoteClassicMapper: accessoryClassicMapper.bind(
    undefined,
    'remoteAssistants'
  )
};

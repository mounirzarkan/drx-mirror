'use strict';
const {
  accessoryClassicMapper,
  remoteClassicMapper
} = require('./accessoryClassicMapper');
const {implantClassicMapper} = require('./implantClassicMapper');
const {soundProcessorClassicMapper} = require('./soundProcessorClassicMapper');
const warrantyClassicMapper = require('./warrantyClassicMapper');
const utils = require('../../util/utils.js');
const {deviceSupportMapper} = require('./deviceSupportMapper');

module.exports = {
  // set warrantyClassicMapper implementation ({dataToGroup,groupToValue}) & set identifier property to installBaseId
  generalWarrantyMapper: utils.groupDataToMap.bind(
    undefined,
    warrantyClassicMapper,
    'installBaseId'
  ),
  // set warrantyClassicMapper implementation ({dataToGroup,groupToValue}) & set identifier property to accessoryId
  accessoryWarrantyMapper: utils.groupDataToMap.bind(
    undefined,
    warrantyClassicMapper,
    'accessoryId'
  ),
  accessoryClassicMapper,
  remoteClassicMapper,
  implantClassicMapper,
  soundProcessorClassicMapper,
  deviceSupportMapper
};

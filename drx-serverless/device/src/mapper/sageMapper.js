const {BOOMIEquipmentConversion} = require('../conversion');
const {log} = require('../util/index.js');

// convert the boomi device list response
function convertSageListResponse(boomiResponse) {
  log.debug('DeviceService, convertSageListResponse: - boomiResponse');
  log.debug(boomiResponse);

  const equipmentData = new BOOMIEquipmentConversion().convertEquipmentList(
    boomiResponse
  );
  log.debug('DeviceService, convertSageListResponse: - equipmentData');
  log.debug(equipmentData);

  return equipmentData;
}

// convert the boomi device detail response
function convertSageDetailResponse(boomiResponse) {
  log.debug('DeviceService, convertSageDetailResponse: - boomiResponse');
  log.debug(boomiResponse);

  const equipmentData = new BOOMIEquipmentConversion().convertEquipment(
    boomiResponse
  );
  log.debug('DeviceService, convertSageDetailResponse: - equipmentData');
  log.debug(equipmentData);

  return equipmentData;
}

module.exports = {convertSageListResponse, convertSageDetailResponse};

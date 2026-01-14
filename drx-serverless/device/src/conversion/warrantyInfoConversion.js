'use strict';

// responsible for the warranty information
class WarrantyConversion {
  constructor(mapper) {
    this.mapper = mapper;
    this.map = new Map();
  }

  // convert data using mapper
  convert(sfData) {
    this.map = this.mapper(sfData);
    return this.map;
  }

  // bounded - get warranty value for device
  match = (device) => {
    return this.map.get(device.id);
  };
}

module.exports = {WarrantyConversion};

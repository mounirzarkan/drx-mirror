'use strict';

// responsible for the device information
class DeviceConversion {
  constructor(mapper) {
    this.mapper = mapper;
    this.items = [];
  }

  // convert data using mapper
  convert(sfData) {
    this.items = this.mapper(sfData);
    return this.items;
  }

  // append items with results from func
  appendWith(func) {
    this.items = this.items.map((item) => ({
      ...item,
      ...(func(item) || {})
    }));
    return this.items;
  }
}

module.exports = {DeviceConversion};

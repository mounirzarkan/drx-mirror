'use strict';

const {DeviceConversion} = require('./deviceInfoConversion.js');
const {WarrantyConversion} = require('./warrantyInfoConversion.js');
const {
  generalWarrantyMapper,
  accessoryWarrantyMapper,
  accessoryClassicMapper,
  remoteClassicMapper,
  implantClassicMapper,
  soundProcessorClassicMapper,
  deviceSupportMapper: deviceSupportProperties
} = require('./classicMapper/index.js');

class EquipmentConversion {
  constructor(hasDeviceSupport) {
    this.hasDeviceSupport = hasDeviceSupport;
  }

  // Converts device and warranty to equipment
  convertClassic(sfData) {
    // initialize conversions with mappers
    const accessoryWarranty = new WarrantyConversion(accessoryWarrantyMapper);
    const generalWarranty = new WarrantyConversion(generalWarrantyMapper);
    const soundProcessors = new DeviceConversion(soundProcessorClassicMapper);
    const accessory = new DeviceConversion(accessoryClassicMapper);
    const remoteAssistants = new DeviceConversion(remoteClassicMapper);
    const implant = new DeviceConversion(implantClassicMapper);

    // convert sfData to experience layer structure
    accessoryWarranty.convert(sfData);
    generalWarranty.convert(sfData);
    soundProcessors.convert(sfData);
    accessory.convert(sfData);
    remoteAssistants.convert(sfData);
    implant.convert(sfData);

    // populate soundProcessors with device support properties.
    soundProcessors.appendWith(
      deviceSupportProperties.bind(undefined, this.hasDeviceSupport)
    );

    // populate devices with warranties.
    soundProcessors.appendWith(generalWarranty.match);
    remoteAssistants.appendWith(generalWarranty.match);
    accessory.appendWith(accessoryWarranty.match);

    return {
      soundProcessorsV2: soundProcessors.items,
      accessories: [...accessory.items, ...remoteAssistants.items],
      implant: implant.items
    };
  }
}

module.exports = EquipmentConversion;

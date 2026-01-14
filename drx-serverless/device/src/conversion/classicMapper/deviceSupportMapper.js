const {colorConvert} = require('../../util/colorConvert.js');

const supportedCFNs = ['Nucleus 6', 'Nucleus 7', 'Nucleus 8', 'Kanso'];

function deviceSupportMapper(isSupported, item) {
  item.hasOpenSR = false;
  item.underWarranty = false;
  item.isSupported = isSupported
    ? supportedCFNs.some(
        (customerFacingName) => customerFacingName === item.customerFacingName
      )
    : false;
  item.modelColor = colorConvert(item.modelColor);
  return item;
}

module.exports = {deviceSupportMapper};

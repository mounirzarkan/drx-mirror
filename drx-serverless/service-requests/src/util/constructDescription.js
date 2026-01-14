const {isEmpty} = require('lodash');

function constructAddress(address, delimiter) {
  let fullAddress = address.address1;
  if (!isEmpty(address.address2)) {
    fullAddress = fullAddress + delimiter + address.address2;
  }
  if (!isEmpty(address.address3)) {
    fullAddress = fullAddress + delimiter + address.address3;
  }
  fullAddress =
    fullAddress +
    delimiter +
    address.city +
    ' ' +
    address.state +
    ' ' +
    address.postcode +
    delimiter +
    address.country +
    delimiter;
  return fullAddress;
}

function formatDate(milliseconds) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  };
  const warrantyDate = new Date(milliseconds);
  return warrantyDate.toLocaleDateString('en-US', options).substring(0, 10);
}

// ToDo: remove this function when we are ready to use the new SFHC description
function constructDescriptionClassic(srForm) {
  let description =
    'recipient: ' + srForm.firstName + ' ' + srForm.lastName + '\n';
  description = description + 'clinic: ' + srForm.clinic + '\n';
  description = description + 'audiologist: ' + srForm.audiologist + '\n';
  description = description + 'device name: ' + srForm.productName + '\n';
  description =
    description + 'device serial number: ' + srForm.serialNumber + '\n';
  description =
    description + 'device category: ' + srForm.customerFacingName + '\n';
  description =
    description + 'device description: ' + srForm.productDescription + '\n';
  description = description + 'device type: ' + srForm.deviceType + '\n';
  description = description + 'device side of ear: ' + srForm.earSide + '\n';
  description =
    description +
    'device activation date: ' +
    formatDate(parseInt(srForm.fittingDate, 10)) +
    '\n';
  description =
    description +
    'device warranty date: ' +
    formatDate(parseInt(srForm.lastWarrantyDate, 10)) +
    '\n';
  description = description + 'problem Topic: ' + srForm.problemTopic + '\n';
  description =
    description + 'problem description: ' + srForm.problemDescription + '\n';
  description =
    description +
    'shipping address: \n' +
    constructAddress(srForm.shippingAddress, '\n') +
    '\n';
  description =
    description +
    'terms and condition ticked: ' +
    srForm.termsConditionTicked +
    '\n';
  return description;
}

// New function for SFHC description
function constructDescription(srForm) {
  let description = 'Device summary' + '\n';
  description = description + srForm.customerFacingName + '\n';
  description =
    description +
    'Warranty expires: ' +
    formatDate(parseInt(srForm.lastWarrantyDate, 10)) +
    '\n';
  description = description + 'Serial number: ' + srForm.serialNumber + '\n';
  description = description + '\n';

  description = description + 'Personal details' + '\n';
  description = description + srForm.firstName + ' ' + srForm.lastName + '\n';
  description = description + 'Email: ' + srForm.email + '\n';
  description = description + 'Mobile number: ' + srForm.mobilePhone + '\n';
  description = description + '\n';

  description = description + 'Shipping address' + '\n';
  description = description + constructAddress(srForm.shippingAddress, '\n');
  description = description + '\n';

  description = description + 'Clinic details' + '\n';
  description = description + srForm.clinic + '\n';
  description = description + srForm.audiologist + '\n';
  description = description + '\n';

  description = description + 'Issue category' + '\n';
  description = description + srForm.problemTopic + '\n';
  description = description + '\n';

  description = description + 'Problem in more detail' + '\n';
  description = description + srForm.problemDescription + '\n';
  description = description + '\n';

  return description;
}
module.exports = {
  constructDescriptionClassic,
  constructDescription
};

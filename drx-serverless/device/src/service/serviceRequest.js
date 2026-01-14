'use strict';
const {isEmpty} = require('lodash');
const {post} = require('axios');
const {log, utils} = require('../util/index.js');

const m = {
  '00N2400000E9a8Q': 'serialNumber',
  email: 'email',
  phone: 'mobilePhone'
};

const sm = {
  orgid: process.env.sfOrgId,
  retURL: 'http://',
  '00N2400000IGOyY': 'Web-Digital',
  origin: 'Web-Digital',
  recordType: '01224000000kDqA',
  reason: 'Service Request',
  '00N2400000IGOxh': 'Online service request'
};

async function submitRequest(cochlear_id, srForm) {
  const webToCaseUrl = process.env.webToCaseUrl;
  log.debug('form submitted from frontend: ');
  log.debug(srForm);

  const serviceRequest = constructSubmitRequest(cochlear_id, srForm);
  log.debug('form to submit: ');
  log.debug(serviceRequest);
  log.debug('webToCaseUrl: ');
  log.debug(webToCaseUrl);

  console.time('SF-submitSR');
  const resp = await post(webToCaseUrl, utils.encodeForm(serviceRequest), {
    headers: {'content-type': 'application/x-www-form-urlencoded'}
  });
  console.timeEnd('SF-submitSR');
  return resp;
}

function constructSubmitRequest(
  cochlear_id,
  srForm,
  mapping = m,
  staticMapping = sm
) {
  const rev = {};
  rev.subject =
    srForm.firstName +
    ' ' +
    srForm.lastName +
    ' - DRX Service Request - ' +
    srForm.deviceType;
  rev['00N2400000JKElL'] = cochlear_id;

  for (const key in staticMapping) {
    if (Object.prototype.hasOwnProperty.call(staticMapping, key)) {
      rev[key] = staticMapping[key];
    }
  }

  let frontKey;
  for (const key in mapping) {
    if (Object.prototype.hasOwnProperty.call(mapping, key)) {
      frontKey = mapping[key];
      rev[key] = srForm[frontKey];
    }
  }
  rev.description = constructDescription(srForm);
  rev[process.env.srDescriptionJsonKey] = constructDescriptionJson(srForm);
  return rev;
}

function constructDescription(srForm) {
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

function constructDescriptionJson(srForm) {
  const descriptionJson = {};
  descriptionJson.recipientFirstName = srForm.firstName;
  descriptionJson.recipientLastName = srForm.lastName;
  descriptionJson.email = srForm.email;
  descriptionJson.clinic = srForm.clinic;
  descriptionJson.audiologist = srForm.audiologist;
  descriptionJson.deviceCategory = srForm.customerFacingName;
  descriptionJson.deviceSerialNumber = srForm.serialNumber;
  descriptionJson.deviceWarrantyDate = formatDate(
    parseInt(srForm.lastWarrantyDate, 10)
  );
  descriptionJson.problemTopic = srForm.problemTopic;
  descriptionJson.problemDescription = srForm.problemDescription;
  descriptionJson.shippingAddress = constructAddress(
    srForm.shippingAddress,
    '<br/>'
  );
  return JSON.stringify(descriptionJson);
}

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

module.exports = {
  constructDescription,
  constructSubmitRequest,
  submitRequest,
  formatDate
};

'use strict';

const {
  SFWebToCaseConnector,
  SFClassicWebToCaseConnector
} = require('../connector/index.js');
const {log} = require('../common/utils/index.js');
const {sfFieldIdHelper} = require('../helpers/sfFieldIdHelper');
const {sfhcFieldIdHelper} = require('../helpers/sfhcFieldIdHelper');
const {countryCodeConverter} = require('../helpers/countryCodeConverter');
const {digitalTrackingDataMapper} = require('../helpers/digitalTrackingDataMapper');

class WebToCaseCommand {
  constructor(config) {
    this.config = config;
  }

  async execute(caseData) {
    // log.debug('=====> WebToCaseCommand: execute');
    const isSFHC = caseData.isSFHC != null;
    log.debug('=====> WebToCaseCommand: isSFHC = ' + isSFHC);
    log.debug('=====> WebToCaseCommand: config.env = ' + this.config.env);
    const fieldData = isSFHC
      ? sfhcFieldIdHelper(this.config.env.toLowerCase())
      : sfFieldIdHelper(this.config.env.toLowerCase());
    // log.debug('=====> WebToCaseCommand: fieldData = ' + fieldData);

    return new Promise((resolve, reject) => {
      const requiredFields = [
        'description',
        'subject',
        'firstName',
        'lastName',
        'email'
      ];

      if (isSFHC) {
        requiredFields.push('country');
      } else {
        requiredFields.push('reason', 'recordType');
      }

      if (!requestValidator(caseData, requiredFields)) {
        reject('Unable to validate request - Check request body');
        return;
      }

      const commonFields = {
        name: `${caseData.firstName} ${caseData.lastName}`,
        subject: caseData.subject,
        email: caseData.email,
        phone: caseData.phone,
        orgid: fieldData.orgid.value,
        origin: caseData.origin || 'Web'
      };

      // concatenate romaji name if present - note the dash is an em dash
      if (
        ['firstNameLocal', 'lastNameLocal'].every(field =>
          isValidField(caseData, field)
        )
      ) {
        commonFields.name += `—${caseData.firstNameLocal} ${caseData.lastNameLocal}`;
      }

      const processedCaseData = isSFHC
        ? {
            ...commonFields,
            [fieldData.country.field]: countryCodeConverter(caseData.country), // Country
            [fieldData.reason.field]: caseData.reason || '',
            [fieldData.subStatus.field]: 'New',
            [fieldData.digitalTrackingData.field]: digitalTrackingDataMapper(caseData),
            description: caseData.description,
            recordType: fieldData.recordType.value,
            status: 'Open',
            [fieldData.sourceSystem.field]: caseData.HealthCloudGA__SourceSystem__c || ''
          }
        : {
            ...commonFields,
            description: descriptionMapper(caseData),
            [fieldData.descriptionJson.field]: JSON.stringify(
              descriptionReducer(caseData)
            ), //description_JSON
            [fieldData.country.field]: caseData.country, // Country
            [fieldData.origin.field]: 'Web', // Origin
            [fieldData.region.field]: caseData.country, // Map Region to Country Value
            reason: caseData.reason,
            recordType: caseData.recordType
          };

      if (fieldData.debug.field) {
        processedCaseData['debug'] = 1;
        processedCaseData['debugEmail'] = caseData.debugEmail || caseData.email;
      }

      const reqBody = new URLSearchParams(processedCaseData).toString();
      // log.debug('=====> WebToCaseCommand: reqBody = ' + reqBody);

      let data;

      const Connector = isSFHC
        ? SFWebToCaseConnector
        : SFClassicWebToCaseConnector;
      const connectorInstance = new Connector(this.config);
      data = connectorInstance.webToCase(reqBody);
      log.debug('=====> WebToCaseCommand: data to resolve = ' + JSON.stringify(data));

      return resolve(data);
    });
  }
}

/*
Add keys without salesforce equivalent fields from form request to description field
*/

function descriptionMapper(request) {
  // log.debug('=====> WebToCaseCommand: descriptionMapper');
  return descriptionFilter(request)
    .map(key => {
      return `${key}: ${request[key]}`;
    })
    .join('\n');
}

function descriptionReducer(request) {
  // log.debug('=====> WebToCaseCommand: descriptionReducer');
  return descriptionFilter(request).reduce((obj, key) => {
    obj[key] = request[key];
    return obj;
  }, {});
}

function descriptionFilter(request) {
  // log.debug('=====> WebToCaseCommand: descriptionFilter');
  var keyArray = ['orgid'];
  return Object.keys(request).filter(key => keyArray.indexOf(key) < 0);
}

function isValidField(requestBody, field) {
  // log.debug('=====> WebToCaseCommand: isValidField');
  return !!(requestBody[field] && typeof requestBody[field] === 'string');
}

function requestValidator(requestBody, requiredFields) {
  // log.debug('=====> WebToCaseCommand: requestValidator');

  if (!requestBody) {
    log.debug(
      "=====> WebToCaseCommand: requestValidator - ERROR - Request isn't defined"
    );
    return false;
  }

  for (const field of requiredFields) {
    if (!isValidField(requestBody, field)) {
      log.debug(
        `=====> WebToCaseCommand: requestValidator - ERROR - ${field} is undefined or incorrect type`
      );
      return false;
    }
  }

  return true;
}

module.exports = WebToCaseCommand;

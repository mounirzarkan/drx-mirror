'use strict';

const _ = require('lodash');
const xss = require('xss');
const log = require('./logUtil');

function checkAllArgsNotEmpty(args) {
  if (_.isEmpty(args)) {
    return false;
  } else {
    let j;
    for (j = 0; j < args.length; j++) {
      if (_.isEmpty(args[j])) {
        return false;
      }
    }
    return true;
  }
}

function getSFIntegrationCreds(_hostname, _clientId, _userName, _secretString) {
  if (!checkAllArgsNotEmpty(arguments)) {
    throw new Error('invalid input.');
  }
  const secretJson = JSON.parse(_secretString);
  const credentials = {
    hostname: _hostname,
    clientSecret: secretJson.clientSecret,
    clientId: _clientId,
    username: _userName,
    password: secretJson.password,
    secretToken: secretJson.secret
  };

  return credentials;
}

function encodeForm(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

function sanitiseString(field) {
  return xss(field);
}

function isValidPathParameter(param) {
  const sanitizedParam = sanitiseString(param);
  const allowedCharacters = /^[0-9]+$/;
  return allowedCharacters.test(sanitizedParam);
}

function stringCompareIgnoreCase(str1, str2) {
  let result = false;
  if (
    (str1 == null || str1 == undefined || str1.trim().length == 0) &&
    (str2 == null || str2 == undefined || str2.trim().length == 0)
  ) {
    result = true;
  } else if (
    !_.isEmpty(str1) &&
    !_.isEmpty(str2) &&
    str1.trim().toUpperCase() === str2.trim().toUpperCase()
  ) {
    result = true;
  }

  return result;
}

//getOcSmsObj(params.sub_userType,params.sub,params.obj)
function includeOcSms(sub_userType, sub, obj) {
  if (sub === obj && stringCompareIgnoreCase('Carer', sub_userType)) {
    return false;
  }

  log.debug('sub === obj ');
  log.debug(sub === obj);

  log.debug("stringCompareIgnoreCase('Carer', sub_userType)");
  log.debug(stringCompareIgnoreCase('Carer', sub_userType));

  return true;
}

function abbreviatePermissions(obj) {
  const _obj = _.cloneDeep(obj);
  let readOnlyForm = true;
  for (const property in _obj) {
    if (_obj[property] && _obj[property].value) {
      const value = _obj[property].value.toLowerCase();
      if (value === 'read and write') {
        readOnlyForm = false;
        _obj[property].value = 'rw';
      } else if (value === 'read only') {
        _obj[property].value = 'r';
      } else {
        //"not applicable"
        _obj[property].value = value;
      }
    }
  }
  return {abbreviateObj: _obj, readOnlyForm};
}

function decorateObject(object = {}, decorations = {}) {
  const decorated = {};
  for (const [field, permission] of Object.entries(decorations)) {
    if ('_metadata' === field) {
      decorated[field] = permission;
    } else if (!_.isEmpty(permission)) {
      if (object[field] === undefined) {
        decorated[field] = {value: '', permission: permission.value};
      } else {
        decorated[field] = {
          value: object[field],
          permission: permission.value
        };
      }
    }
  }
  log.debug('utils, after decorateObject:');
  log.debug(decorated);
  return decorated;
}

function getUserTypeFromRecordType(recordType) {
  let userType = recordType;
  if (stringCompareIgnoreCase('Requester', recordType)) {
    userType = 'Carer';
  }
  return userType;
}

function isAboveAgeBracket(timeStamp, updateAge) {
  const today = new Date();
  const todayYear = today.getUTCFullYear();
  const todayMonth = today.getUTCMonth();
  const todayDay = today.getUTCDate();
  const birthday = new Date(timeStamp);
  const birthdayYear = birthday.getUTCFullYear();
  const birthdayMonth = birthday.getUTCMonth();
  const birthdayDay = birthday.getUTCDate();

  log.debug('debug, updateAge: ');
  log.debug(updateAge);
  log.debug('debug, dob: ');
  log.debug(birthdayYear);
  log.debug(birthdayMonth);
  log.debug(birthdayDay);

  if (birthdayYear > todayYear - updateAge) {
    return false;
  } else if (
    birthdayYear === todayYear - updateAge &&
    birthdayMonth > todayMonth
  ) {
    return false;
  } else if (
    birthdayYear === todayYear - updateAge &&
    birthdayMonth === todayMonth &&
    birthdayDay > todayDay
  ) {
    return false;
  } else {
    return true;
  }
}

function pickByHas(implementation, obj) {
  return _.pickBy(obj, (value, key) => {
    return implementation.has(key);
  });
}

function calculatePersonas(userType, personas) {
  let updatedPersonas = personas;
  if (
    userType === 'Recipient' &&
    personas.includes('Carer') &&
    personas.includes('Recipient')
  ) {
    updatedPersonas = ['Recipient'];
  }
  return updatedPersonas;
}

module.exports = {
  checkAllArgsNotEmpty,
  getSFIntegrationCreds,
  encodeForm,
  sanitiseString,
  isValidPathParameter,
  decorateObject,
  stringCompareIgnoreCase,
  includeOcSms,
  getUserTypeFromRecordType,
  isAboveAgeBracket,
  abbreviatePermissions,
  pickByHas,
  calculatePersonas
};

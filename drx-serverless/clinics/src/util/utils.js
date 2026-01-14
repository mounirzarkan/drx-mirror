'use strict';

const _ = require('lodash');
const xss = require('xss');
const log = require('./logUtil.js');
const regionsToCountries = require('../data/regionToCountries.json');

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

function encodeForm(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

function sanitiseString(field) {
  return xss(field);
}

function decorateObject(object = {}, decorations = {}) {
  let decorated = {};
  for (const [field, permission] of Object.entries(decorations)) {
    if ('_metadata' === field) {
      decorated[field] = permission;
    } else if (!_.isEmpty(permission)) {
      if (object[field] === undefined) {
        //if (_.isEmpty(object[field])) {
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

function logErrorMessage(err) {
  if (err) {
    log.debug(err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      log.debug(err.response);
      log.debug(err.response.data);
      log.debug(err.response.status);
      log.debug(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      log.debug(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      log.debug(err.message);
    }
  }
}

function convertIdsToString(arr) {
  return arr.map(obj => {
    if (obj.hasOwnProperty('id') && typeof obj.id === 'number') {
      obj.id = obj.id.toString();
    }
    return obj;
  });
}

function convertIdsToNumber(arr) {
  return arr.map(obj => {
    if (obj.hasOwnProperty('id') && typeof obj.id === 'string') {
      obj.id = Number(obj.id);
    }
    return obj;
  });
}

function sortList(list, sortParams) {
  let key = sortParams.sortField;
  const sortedList = [...list];
  const tempList = convertIdsToNumber(sortedList);

  // end of list for null or undefined values.
  const nils = tempList.filter(x => _.isNil(x[sortParams.sortField]));
  const values = tempList.filter(x => !_.isNil(x[sortParams.sortField]));

  if (sortParams.sortField) {
    values.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  if (sortParams.sortOrder.toLowerCase() === 'desc') {
    values.reverse();
  }

  const finalList = convertIdsToString(values);

  return [...finalList, ...nils];
}

function isIfu(url) {
  // Regular expression pattern for IFU type URLs
  var pattern = /^https:\/\/mss-p-007-delivery\.stylelabs\.cloud\/api\/public\/content\/[A-Z0-9_]+_[0-9]{1,2}_[0-9]{4}-[0-9]{2}-[0-9]{2}\?v=[a-z0-9]+$/;
  return pattern.test(url);
}

function getDocumentNumber(url) {
  // Regular expression pattern to match the value
  var pattern = /\/([A-Z0-9_]+)_[0-9]{1,2}_[0-9]{4}-[0-9]{2}-[0-9]{2}\?v=[a-z0-9]+$/;
  var match = url.match(pattern);
  return match ? match[1] : null;
}

function getIds(data) {
  const ids = data.map(function(child) {
    const parts = child.href.split('/');
    return parts[parts.length - 1];
  });

  return ids;
}

function extractVersionAndDate(inputString) {
  // Define a regular expression to match the pattern
  const regex = /^D(\d+)_(\d+)_(\d{4}-\d{2}-\d{2})$/;

  // Use the regular expression to extract version and date
  const match = inputString.match(regex);

  if (match) {
    // Extracted values from the match
    const version = parseInt(match[2], 10);
    const date = match[3];

    // Return the result as a JSON object
    return {
      version: version,
      publishedDate: date
    };
  } else {
    // Return null if the input string doesn't match the expected pattern
    return null;
  }
}

const matchIdFromEntityUrl = url => {
  const matched = url.match(/api\/entities\/(\d+)/);
  if (matched) {
    return matched[1];
  }
  return '';
};

const matchPublishDateFromLink = link => {
  const matched = link.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
  if (matched) {
    return {
      publishDate: matched[0],
      version: link.match(/(?<=_).*?(?=_)/)[0]
    };
  }

  return {publishDate: '', version: ''};
};

const convertCsvStringToArray = str => {
  const array = str.toLowerCase().split(/,\s*/);
  return array;
};

function removeNullValues(obj) {
  // log.debug('=====> utils, removeNullValues: obj = ' + obj);
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    // log.debug('=====> utils, removeNullValues: obj isArray');
    return obj.filter(item => item !== null).map(removeNullValues);
  }

  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== null) {
      newObj[key] = removeNullValues(obj[key]);
      log
        .debug
        // '=====> utils, removeNullValues: newObj[' + key + '] = ' + newObj[key]
        ();
    }
  }
  return newObj;
}

const allRegions = {
  CAM: regionsToCountries.CAM.fields.map(({name}) => name),
  EMEA: regionsToCountries.EMEA.fields.map(({name}) => name),
  APAC: regionsToCountries.APAC.fields.map(({name}) => name),
  CLASA: regionsToCountries.CLASA.fields.map(({name}) => name)
};

const getRegionOfCountry = country =>
  (Object.entries(allRegions).find(([, countries]) =>
    countries.includes(country)
  ) || [''])[0];

function paginate(array, pageNumber, itemsPerPage) {
  --pageNumber;
  return array.slice(
    pageNumber * itemsPerPage,
    (pageNumber + 1) * itemsPerPage
  );
}

function isIterable(obj) {
  return typeof obj[Symbol.iterator] === 'function';
}

function replaceUrlDomain(url, domain) {
  return url.replace(/https:\/\/[^/]+/, domain);
}

module.exports = {
  checkAllArgsNotEmpty,
  encodeForm,
  sanitiseString,
  decorateObject,
  stringCompareIgnoreCase,
  getUserTypeFromRecordType,
  isAboveAgeBracket,
  abbreviatePermissions,
  logErrorMessage,
  sortList,
  convertIdsToString,
  convertIdsToNumber,
  isIfu,
  getDocumentNumber,
  getIds,
  extractVersionAndDate,
  matchIdFromEntityUrl,
  matchPublishDateFromLink,
  convertCsvStringToArray,
  getRegionOfCountry,
  removeNullValues,
  paginate,
  isIterable,
  replaceUrlDomain
};

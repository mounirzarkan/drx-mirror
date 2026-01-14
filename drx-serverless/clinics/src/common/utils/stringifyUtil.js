'use strict';

const _ = require('lodash');
const xss = require('xss');

const SENSITIVEDATALIST = require('../data/sensitiveDataList.json').map(x =>
  _.toUpper(x)
);

const MASK_WORDING = 'masked by logUtils';

function getLogMaskWording() {
  return MASK_WORDING;
}

function getSensitiveData() {
  return SENSITIVEDATALIST;
}

function sanitiseString(field) {
  return xss(field);
}

function stringifyWithMask(hideSensitiveData, sensitiveDataList, data) {
  function replacer(key, value) {
    if (_.includes(sensitiveDataList, _.toUpper(key))) {
      return MASK_WORDING;
    } else {
      return value;
    }
  }
  let stringifyed;
  if (hideSensitiveData) {
    stringifyed = JSON.stringify(data, replacer);
  } else {
    stringifyed = JSON.stringify(data);
  }
  return stringifyed;
}

module.exports = {
  getSensitiveData,
  stringifyWithMask,
  getLogMaskWording,
  sanitiseString
};

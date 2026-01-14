'use strict';

const {v4: uuidv4} = require('uuid');
const _ = require('lodash');

function generateSessionId() {
  return uuidv4();
}

function generateTokenId() {
  return uuidv4();
}

function getTokenValue(authorization) {
  const authorizationValues = _.split(authorization, ' ');
  // console.debug('arr: ', authorizationValues);
  if (authorizationValues.length === 2) {
    return authorizationValues[1].trim();
  } else {
    return '';
  }
}

function isProfessionalUserType(str) {
  const terms = [
    'ContentProfessional',
    'OnlineSupportProfessional',
    'RegistrationProfessional',
    'Professional'
  ];

  for (let term of terms) {
    if (str.includes(term)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  getTokenValue,
  generateSessionId,
  generateTokenId,
  isProfessionalUserType
};

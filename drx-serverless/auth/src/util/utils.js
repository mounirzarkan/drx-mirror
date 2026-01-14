'use strict';

const {v4: uuidv4} = require('uuid');

const CHAR_SET =
  'abcdefghijlkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function maxRandomNumber(max) {
  return Math.floor(Math.random() * max);
}
function generateRandomString(length) {
  let random_string = '';
  for (let i = 0; i < length; i++) {
    random_string += CHAR_SET[maxRandomNumber(CHAR_SET.length - 1)];
  }
  return random_string;
}

function generateSessionId() {
  return uuidv4();
}

function generateTokenId() {
  return uuidv4();
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
  generateRandomString,
  generateSessionId,
  generateTokenId,
  isProfessionalUserType,
  calculatePersonas
};

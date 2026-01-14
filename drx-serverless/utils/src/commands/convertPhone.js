'use strict';

const parsePhoneNumber = require('libphonenumber-js');

function convertPhoneNumber(number) {
  try {
    var data = parsePhoneNumber(number);

    return {
      country: data.country,
      countryCallingCode: data.countryCallingCode,
      number: data.number,
      nationalNumber: data.nationalNumber
    };
  } catch (ex) {
    throw 'invalid phone number';
  }
}

module.exports = {
  convertPhoneNumber
};

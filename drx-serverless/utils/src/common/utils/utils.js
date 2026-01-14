'use strict';

const {isEmpty} = require('lodash');
const xss = require('xss');
const {parse} = require('node-html-parser');
const SimpleCrypto = require('simple-crypto-js').default;
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;
const log = require('./logUtil.js');

function checkAllArgsNotEmpty(args) {
  if (isEmpty(args)) {
    return false;
  } else {
    let j;
    for (j = 0; j < args.length; j++) {
      if (isEmpty(args[j])) {
        return false;
      }
    }
    return true;
  }
}

function encodeForm(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

function sanitiseString(field) {
  return xss(field);
}

function getHtmlAttributes(html, selector, attrList = []) {
  const root = parse(html);
  const element = root.querySelector(selector);
  return attrList.reduce((obj, attr) => {
    obj[attr] = element.getAttribute(attr);
    return obj;
  }, {});
}

function getDefaultLanguage(country, englishSpeakingCountries) {
  console.log('getDefaultLanguage: ', country, englishSpeakingCountries);

  let language = 'en';

  if (englishSpeakingCountries.includes(country.toUpperCase())) {
    return (language = 'en');
  } else {
    switch (country.toUpperCase()) {
      case 'IT':
        return (language = 'it');
      case 'FR':
        return (language = 'fr');
      default:
        break;
    }
  }

  return language;
}

function decrypt(key, cipher) {
  const simpleCrypto = new SimpleCrypto(key);
  return simpleCrypto.decrypt(decodeURIComponent(cipher));
}

module.exports = {
  checkAllArgsNotEmpty,
  encodeForm,
  sanitiseString,
  getHtmlAttributes,
  getDefaultLanguage,
  decrypt
};

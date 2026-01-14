'use strict';

const {isEmpty} = require('lodash');
const xss = require('xss');
const {parse} = require('node-html-parser');

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
    language = 'en';
  } else {
    switch (country.toUpperCase()) {
      case 'IT':
        language = 'it';
        break;
      default:
        language = country.toLowerCase();
        break;
    }
  }
  return language;
}

function getDefaultLocale(country, lng, englishSpeakingCountries) {
  console.log('getDefaultLocale: ', country, englishSpeakingCountries);

  let language = 'en';
  if (englishSpeakingCountries.includes(country.toUpperCase())) {
    language = 'en';
  } else {
    switch (country.toUpperCase()) {
      case 'IT':
        language = 'it-IT';
        break;
      default:
        return (language = lng.toLowerCase() + '-' + country.toUpperCase());
    }
  }
  return language;
}

module.exports = {
  checkAllArgsNotEmpty,
  encodeForm,
  sanitiseString,
  getHtmlAttributes,
  getDefaultLanguage,
  getDefaultLocale
};

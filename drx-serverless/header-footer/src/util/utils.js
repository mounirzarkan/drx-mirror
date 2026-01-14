'use strict';
const {parse} = require('node-html-parser');
const {v4: uuidv4} = require('uuid');

function getHtmlAttributes(html, selector, attrList = []) {
  try {
    const root = parse(html);
    const element = root.querySelector(selector);
    const attributes = {};

    // Get attributes that exist
    attrList.forEach((attr) => {
      const value = element.getAttribute(attr);
      if (value !== null) {
        attributes[attr] = value;
      }
    });

    return attributes;
  } catch (e) {
    // If an error occurs, return an empty object
    return {};
  }
}

function generateSessionId() {
  return uuidv4();
}

function generateTokenId() {
  return uuidv4();
}

function addNamespace(namespace, field) {
  return namespace + '/' + field;
}

module.exports = {
  generateSessionId,
  generateTokenId,
  addNamespace,
  getHtmlAttributes
};

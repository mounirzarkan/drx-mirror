'use strict';

const log = require('../util/logUtil.js');
const axios = require('axios').default;

async function getIdpConfig(url) {
  log.debug('in idpConnector, start getIdpConfig, url:');
  log.debug(url);
  console.time('SF-getIdpConfig');
  const resp = await axios.get(url);
  console.timeEnd('SF-getIdpConfig');
  const idpConfig = resp.data;

  return idpConfig;
}

async function getIdpKeys(url) {
  log.debug('in idpConnector, start getIdpKeys, url:');
  log.debug(url);
  console.time('SF-getIdpKeys');
  const resp = await axios.get(url);
  console.timeEnd('SF-getIdpKeys');
  const idpKeys = resp.data;

  return idpKeys;
}

module.exports = {
  getIdpConfig,
  getIdpKeys
};

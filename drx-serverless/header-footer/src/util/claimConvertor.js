'use strict';

const log = require('./logUtil.js');
const utils = require('./utils.js');
const _ = require('lodash');

function getClaims(namespace, attributes) {
  log.debug('getClaim params:');
  log.debug(namespace);
  log.debug(attributes);

  const claims = {};
  //mandatory standard jwt claims
  claims.sub = attributes['User.CochlearId'];
  // claims.given_name = attributes['User.FirstName'];
  // claims.family_name = attributes['User.LastName'];
  // claims.locale = attributes['User.LanguageCode'];

  //mandatory need namespace
  // claims[utils.addNamespace(namespace, 'country_code')] =
  //   attributes['User.CountryCode'];
  claims[utils.addNamespace(namespace, 'login_app')] =
    attributes['User.LoginAppName'];
  claims[utils.addNamespace(namespace, 'user_type')] =
    attributes['User.CIMUserType'];

  // claims.userName = attributes['User.CochlearUserName'];

  return claims;
}

function filterJwtConfig(decoded, config) {
  log.debug('incoming decoded, config');
  log.debug(decoded);
  log.debug(config);
  return _.pickBy(decoded, (value, key) => {
    return !_.includes(config, key);
  });
}

function addRLAEntitlement(namespace, claims) {
  claims[utils.addNamespace(namespace, 'app')] = 'rla';
  return claims;
}

module.exports = {
  getClaims,
  filterJwtConfig,
  addRLAEntitlement
};

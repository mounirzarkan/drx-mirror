'use strict';

const {RedisCache} = require('./cache.js');
const AWSConnector = require('./AWSConnector.js');
const SFConnector = require('./SFConnector.js');
const PMConnector = require('./PMConnector.js');
const BOOMIConnector = require('./BOOMIConnector.js');
const DevicesConnector = require('./devicesConnector.js');

module.exports = {
  RedisCache,
  AWSConnector,
  SFConnector,
  PMConnector,
  BOOMIConnector,
  DevicesConnector
};

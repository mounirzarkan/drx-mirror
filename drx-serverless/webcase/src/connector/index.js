'use strict';

const awsConnector = require('./AWSConnector.js');
const SFWebToCaseConnector = require('./SFWebToCaseConnector.js');
const SFClassicWebToCaseConnector = require('./SFClassicWebToCaseConnector.js');

module.exports = {
  awsConnector,
  SFWebToCaseConnector,
  SFClassicWebToCaseConnector
};

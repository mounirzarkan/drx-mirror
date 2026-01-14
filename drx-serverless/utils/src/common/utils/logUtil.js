/*
 logUtil.js export handleLog function that can be used to standarlise the log output

 allowedLogLevel is envirionment parameter, "INFO","DEBUG","ERROR","ESSENTIAL"

 ESSENTIAL is used to log predefined event;
 DEBUG, INFO, ERROR will mask sensitiveData, sensitiveData is configurable by JSON file.
 TRACE won't mask sensitiveData.

in the code:
const log = require('./logUtil');

log.error(err);

in future, if we need support logger go to multi destinations, we can simply replace console.log 
with some popular loging npm module eg. winston.
*/
'use strict';

const _ = require('lodash');

const LOG_EVENTS = require('../data/eventConstants');
const stringifyUtil = require('./stringifyUtil');

const TRACE_LEVEL = 'TRACE';
const DEBUG_LEVEL = 'DEBUG';
const INFO_LEVEL = 'INFO';
const ERROR_LEVEL = 'ERROR';
const ESSENTIAL_LEVEL = 'ESSENTIAL';
const AUDIT_LEVEL = 'AUDIT';

const LOG_LEVEL_MAP = new Map();
LOG_LEVEL_MAP.set(ESSENTIAL_LEVEL, 0);
LOG_LEVEL_MAP.set(AUDIT_LEVEL, 1);
LOG_LEVEL_MAP.set(ERROR_LEVEL, 2);
LOG_LEVEL_MAP.set(INFO_LEVEL, 3);
LOG_LEVEL_MAP.set(DEBUG_LEVEL, 4);
LOG_LEVEL_MAP.set(TRACE_LEVEL, 5);

function handleLog(recordLevel = DEBUG_LEVEL, message = {}) {
  const ALLOWEDLOGLEVEL = LOG_LEVEL_MAP.has(process.env.logLevel)
    ? process.env.logLevel
    : ERROR_LEVEL;

  // If the recordLevel is ESSENTIAL , print out the original message, It is set on the eventConstants.js and use for filter purpose.
  if (recordLevel === ESSENTIAL_LEVEL) {
    if (_.includes(LOG_EVENTS, message)) {
      console.log(JSON.stringify(message));
    } else {
      console.log('invalid essential log event input');
    }
    return;
  }

  // clone the message so it can be changed without affect the original value
  const logMessageBody = _.cloneDeep(message);

  const hideSensitiveData = recordLevel === TRACE_LEVEL ? false : true;

  if (LOG_LEVEL_MAP.get(recordLevel) <= LOG_LEVEL_MAP.get(ALLOWEDLOGLEVEL)) {
    console.log(
      stringifyUtil.stringifyWithMask(
        hideSensitiveData,
        stringifyUtil.getSensitiveData(),
        logMessageBody
      )
    );
  }
}

function trace(message) {
  try {
    handleLog(TRACE_LEVEL, message);
  } catch (error) {
    console.log('caught error while log trace');
  }
}

function debug(message) {
  try {
    handleLog(DEBUG_LEVEL, message);
  } catch (error) {
    console.log('caught error while log debug');
  }
}

function info(message) {
  try {
    handleLog(INFO_LEVEL, message);
  } catch (error) {
    console.log('caught error while log info');
  }
}

function error(message) {
  try {
    handleLog(ERROR_LEVEL, message);
  } catch (error) {
    console.log('caught error while log error');
  }
}

function audit(message) {
  try {
    handleLog(AUDIT_LEVEL, message);
  } catch (error) {
    console.log('caught error while log audit');
  }
}

function essential(message) {
  try {
    handleLog(ESSENTIAL_LEVEL, message);
  } catch (error) {
    console.log('caught error while log essential');
  }
}

function logErrorMessage(err) {
  if (err) {
    debug(err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      debug(err.response);
      debug(err.response.data);
      debug(err.response.status);
      debug(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      debug(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      debug(err.message);
    }
  }
}

module.exports = {
  handleLog,
  trace,
  debug,
  info,
  error,
  audit,
  essential,
  logErrorMessage
};

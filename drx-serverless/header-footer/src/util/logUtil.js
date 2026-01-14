/*
 logUtil.js export handleLog function that can be used to standarlise the log output

 allowedLogLevel is envirionment parameter, "INFO","DEBUG","ERROR","ESSENTIAL"

 ESSENTIAL is used to log predefined event;
 DEBUG, INFO, ERROR will mask sensitiveData, sensitiveData is configurable by JSON file.
 TRACE won't mask sensitiveData.

in the code:
const log = require('./logUtil');

log.error(err);

*/
'use strict';

const _ = require('lodash');

const LOG_EVENTS = require('../config/eventConstants.js');
const SENSITIVEDATALIST = require('../config/sensitiveDataList.json').map((x) =>
  _.toUpper(x)
);

const TRACE_LEVEL = 'TRACE';
const DEBUG_LEVEL = 'DEBUG';
const INFO_LEVEL = 'INFO';
const ERROR_LEVEL = 'ERROR';
const ESSENTIAL_LEVEL = 'ESSENTIAL';

const LOG_LEVEL_MAP = new Map();
LOG_LEVEL_MAP.set(ESSENTIAL_LEVEL, 0);
LOG_LEVEL_MAP.set(ERROR_LEVEL, 1);
LOG_LEVEL_MAP.set(INFO_LEVEL, 2);
LOG_LEVEL_MAP.set(DEBUG_LEVEL, 3);
LOG_LEVEL_MAP.set(TRACE_LEVEL, 4);

const MASK_WORDING = 'masked by logUtils';

function getSensitiveData() {
  return SENSITIVEDATALIST;
}

function stringifyWithMask(hideSensitiveData, sensitiveDataList, data) {
  function replacer(key, value) {
    if (_.includes(sensitiveDataList, _.toUpper(key))) {
      return MASK_WORDING;
    } else {
      return value;
    }
  }
  let stringifyed;
  if (hideSensitiveData) {
    stringifyed = JSON.stringify(data, replacer);
  } else {
    stringifyed = JSON.stringify(data);
  }
  return stringifyed;
}

function handleLog(recordLevel = DEBUG_LEVEL, message = {}) {
  const ALLOWEDLOGLEVEL = LOG_LEVEL_MAP.has(process.env.logLevel)
    ? process.env.logLevel
    : ERROR_LEVEL;

  // If the recordLevel is ESSENTIAL , print out the original message, It is set on the eventConstants.js and use for filter purpose.
  if (recordLevel === ESSENTIAL_LEVEL) {
    if (_.includes(LOG_EVENTS, message)) {
      switch (recordLevel) {
        case ESSENTIAL_LEVEL:
          console.log(JSON.stringify(message));
          break;
        case ERROR_LEVEL:
          console.error(JSON.stringify(message));
          break;
        case INFO_LEVEL:
          console.info(JSON.stringify(message));
          break;
        case DEBUG_LEVEL:
          console.debug(JSON.stringify(message));
          break;
        case TRACE_LEVEL:
          console.trace(JSON.stringify(message));
          break;
      }
    } else {
      console.log('invalid essential log event input');
    }
    return;
  }

  // clone the message so it can be changed without affect the original value
  const logMessageBody = _.cloneDeep(message);

  const hideSensitiveData = recordLevel === TRACE_LEVEL ? false : true;

  if (LOG_LEVEL_MAP.get(recordLevel) <= LOG_LEVEL_MAP.get(ALLOWEDLOGLEVEL)) {
    switch (recordLevel) {
      case ESSENTIAL_LEVEL:
        console.log(
          stringifyWithMask(
            hideSensitiveData,
            getSensitiveData(),
            logMessageBody
          )
        );
        break;
      case ERROR_LEVEL:
        console.error(
          stringifyWithMask(
            hideSensitiveData,
            getSensitiveData(),
            logMessageBody
          )
        );
        break;
      case INFO_LEVEL:
        console.info(
          stringifyWithMask(
            hideSensitiveData,
            getSensitiveData(),
            logMessageBody
          )
        );
        break;
      case DEBUG_LEVEL:
        console.debug(
          stringifyWithMask(
            hideSensitiveData,
            getSensitiveData(),
            logMessageBody
          )
        );
        break;
      case TRACE_LEVEL:
        console.trace(
          stringifyWithMask(
            hideSensitiveData,
            getSensitiveData(),
            logMessageBody
          )
        );
        break;
    }
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

function essential(message) {
  try {
    handleLog(ESSENTIAL_LEVEL, message);
  } catch (error) {
    console.log('caught error while log essential');
  }
}

module.exports = {
  handleLog,
  getSensitiveData,
  stringifyWithMask,
  SENSITIVEDATALIST,
  MASK_WORDING,
  trace,
  debug,
  info,
  error,
  essential
};

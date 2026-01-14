'use strict';

function getKey(keyConfig) {
  return (
    keyConfig.env +
    keyConfig.separator +
    keyConfig.prefixName +
    keyConfig.subSeparator +
    keyConfig.appName +
    keyConfig.separator +
    keyConfig.logicName +
    keyConfig.separator +
    keyConfig.identity
  );
}

//deprecated
function getOriginalKey(keyConfig) {
  return (
    keyConfig.prefixName +
    keyConfig.subSeparator +
    keyConfig.env +
    keyConfig.subSeparator +
    keyConfig.appName +
    keyConfig.subSeparator +
    keyConfig.logicName
  );
}
module.exports = {getKey, getOriginalKey};

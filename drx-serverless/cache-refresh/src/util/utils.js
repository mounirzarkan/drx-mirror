'use strict';

function isValidName(appName) {
  const regex = new RegExp(/^[A-Za-z0-9-]+$/);
  return regex.test(appName);
}

module.exports = {isValidName};

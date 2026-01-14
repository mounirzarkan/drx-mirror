'use strict';

const {isEmpty, isNil} = require('lodash');
const log = require('./logUtil.js');
const xss = require('xss');

/**
 * It takes an array of objects, groups them by a property, and returns a map of the grouped data.
 * @param tool - an object with two functions: {dataToGroup,groupToValue}
 * @param property - the property to group by
 * @param data - an array of objects
 * @returns A map with the key being the id and the value being the item.
 */
function groupDataToMap(tool, property, data) {
  /* obj with key properties */
  const groups = tool.dataToGroup(data, property);
  const map = new Map();

  /* Iterating over the keys in the groups object and setting the key to the map. */
  for (const id in groups) {
    const group = groups[id];

    /* contains group data to item value */
    const item = tool.groupToValue(group);
    map.set(id, item);
  }
  return map;
}

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

function getSFIntegrationCreds(hostname, clientId, userName, secretString) {
  if (!checkAllArgsNotEmpty(arguments)) {
    throw new Error('invalid input.');
  }
  const secretJson = JSON.parse(secretString);
  const credentials = {
    hostname: hostname,
    clientSecret: secretJson.clientSecret,
    clientId: clientId,
    username: userName,
    password: secretJson.password,
    secretToken: secretJson.secret
  };

  return credentials;
}

function encodeForm(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

function sanitiseString(field) {
  return xss(field);
}

function isValidPathParameter(param) {
  const sanitizedParam = sanitiseString(param);
  const allowedCharacters = /^[0-9]+$/;
  return allowedCharacters.test(sanitizedParam);
}

function filterList(list, filterParams) {
  list = list.filter(
    (x) =>
      x[filterParams.filterField].toLowerCase() ==
      filterParams.filterValue.toLowerCase()
  );
  return list;
}

function paginateList(list, page, pagesize = 20) {
  const start = page == 0 ? 0 : page * pagesize;
  let end = start + pagesize;

  if (list.length < end - 2) end = list.length;

  if (list.length < start - 2) {
    list = [];
  }

  list = list.slice(start, end);

  return list;
}

function sortList(list, sortParams) {
  console.log(list, sortParams);
  const key = sortParams.sortField;
  console.log(key);
  const sortedList = [...list];
  console.log(sortList);
  // end of list for null or undefined values.
  const nils = sortedList.filter((x) => isNil(x[sortParams.sortField]));
  const values = sortedList.filter((x) => !isNil(x[sortParams.sortField]));
  console.log(nils);
  console.log(values);

  if (sortParams.sortField) {
    values.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  if (sortParams.sortOrder.toLowerCase() == 'desc') {
    values.reverse();
  }

  return [...values, ...nils];
}

function flattenList(list) {
  var ls = new Array();

  for (const [key, value] of Object.entries(list)) {
    if (key != 'contracts') {
      value.forEach((row) => {
        row.type = key;
        ls.push(row);
      });
    }
  }

  return ls;
}

function findDevice(devicesList, property, deviceId) {
  const deviceListProperty = devicesList.data?.[property];
  return deviceListProperty?.find((device) => device.id === deviceId);
}

async function isMockedUser(mockUsers, user) {
  log.debug('isMockedUser: - mockUsers');
  log.debug(mockUsers);

  log.debug('isMockedUser: - cochlearId');
  log.debug(user);

  let isMockedUser = false;

  try {
    if (mockUsers.split(',').indexOf(user) === -1) {
      isMockedUser = false;
      log.debug('isMockedUser: - isMockedUser');
      log.debug(isMockedUser);

      return isMockedUser;
    }

    isMockedUser = true;
    log.debug('isMockedUser: - isMockedUser');
    log.debug(isMockedUser);

    return isMockedUser;
  } catch (e) {
    log.debug('isMockedUser: -  isMockedUser err');
    log.debug(e);

    return isMockedUser;
  }
}

module.exports = {
  checkAllArgsNotEmpty,
  getSFIntegrationCreds,
  encodeForm,
  sanitiseString,
  isValidPathParameter,
  groupDataToMap,
  flattenList,
  filterList,
  sortList,
  paginateList,
  findDevice,
  isMockedUser
};

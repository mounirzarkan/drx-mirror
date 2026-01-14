const _ = require('lodash');
const log = require('./logUtil.js');
const xss = require('xss');

function filterObjProperties(originalObj, properties) {
  return properties.reduce((decorateObj, property) => {
    if (Object.prototype.hasOwnProperty.call(originalObj, property)) {
      decorateObj[property] = originalObj[property];
    }
    return decorateObj;
  }, {});
}

function stringCompareIgnoreCase(str1, str2) {
  let result = false;
  if (
    (str1 == null || str1 == undefined || str1.trim().length == 0) &&
    (str2 == null || str2 == undefined || str2.trim().length == 0)
  ) {
    result = true;
  } else if (
    !_.isEmpty(str1) &&
    !_.isEmpty(str2) &&
    str1.trim().toUpperCase() === str2.trim().toUpperCase()
  ) {
    result = true;
  }

  return result;
}

function sanitiseString(field) {
  return xss(field);
}

function isValidPathParameter(param) {
  const sanitizedParam = sanitiseString(param);
  const allowedCharacters = /^[0-9]+$/;
  return allowedCharacters.test(sanitizedParam);
}

function getQueryPartyId(partyId, carerRecipients, sub, obj, userType) {
  if (sub) {
    if (sub === obj) {
      //query themselves
      return partyId;
    } else if (
      obj &&
      userType &&
      stringCompareIgnoreCase(userType, 'Carer') &&
      Array.isArray(carerRecipients)
    ) {
      //check carer query recipient
      const recipient = carerRecipients.find(({CochlearId}) => {
        return CochlearId && CochlearId + '' === obj + '';
      });
      return (
        (recipient && recipient.PartyId && recipient.PartyId + '') || undefined
      );
    }
  }
  return undefined;
}

function addCurrency(first, second, toFixed) {
  return (
    (Number.parseFloat(first) * 10 ** toFixed +
      Number.parseFloat(second) * 10 ** toFixed) *
    (1 / 10 ** toFixed)
  ).toFixed(toFixed);
}

function formatDate(isoString) {
  // Create a new Date object using the ISO 8601 string
  const date = new Date(isoString);

  // Get the timezone offset in minutes and convert it to milliseconds
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  // Adjust the date by the timezone offset
  const localDate = new Date(date.getTime() - timezoneOffset);

  // Get the year, month, and day parts of the date
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(localDate.getDate()).padStart(2, '0');

  // Combine the parts into the desired format
  return `${year}-${month}-${day}`;
}

function mergeOrderHeadersData(sourceArray, lookupArray, propertiesToMerge) {
  // Create a map from the lookup array for efficient access
  // The keys are the orderIds and the values are the entire objects
  const lookupMap = new Map(lookupArray.map((item) => [item.orderId, item]));

  // Use reduce to build the result array
  return sourceArray.reduce((accumulator, sourceItem) => {
    // Try to find the matching item in the lookup map using the id of the source item
    const matchingItem = lookupMap.get(sourceItem.id);

    // If a matching item is found, merge it with the source item
    if (matchingItem) {
      // Start with the source item
      const mergedItem = {...sourceItem};

      // Merge each property from the matching item that is listed in propertiesToMerge
      for (const property of propertiesToMerge) {
        mergedItem[property] = matchingItem[property] || '';
      }

      // Add the merged item to the accumulator array
      accumulator.push(mergedItem);
    }

    // Return the accumulator for the next iteration
    return accumulator;
  }, []);
}

function mergeOrderLinesData(data, country) {
  log.debug('mergeOrderLinesData: - data');
  log.debug(data);

  let matchingHeaderInfo;
  let mergedLineUS = {};
  if (country === 'US' || country === 'PR') {
    // Find the matching header info for the lines
    matchingHeaderInfo = data.headerInfo.find(
      (header) => header.orderId === data.lines.id.toString()
    );
    mergedLineUS = {
      orderStatus: matchingHeaderInfo.orderStatus,
      orderType: matchingHeaderInfo.orderType,
      orderCreationDate: matchingHeaderInfo.orderCreationDate,
      gatheringDocStartedDate: matchingHeaderInfo.gatheringDocStartedDate,
      insuranceAuthorisationStartedDate:
        matchingHeaderInfo.insuranceAuthorisationStartedDate,
      prepareShippingStartedDate: matchingHeaderInfo.prepareShippingStartedDate,
      shippedDate: matchingHeaderInfo.shippedDate,
      lastUpdateDate: matchingHeaderInfo.lastUpdateDate,
      trackingNumber: matchingHeaderInfo.trackingNumber,
      shippingUrl: matchingHeaderInfo.shippingUrl
    };
  }
  // Generate the order lines
  const orderLines = data.lines.orderItems.map((item, index) => {
    return {
      id: data.lines.id,
      orderNumber: data.lines.orderNumber,
      itemNumber: item.itemNumber,
      quantity: item.quantity,
      partNumber: item.product.partNumber,
      description: item.product.description,
      status: item.status,
      itemPrice: item.itemPrice?.toFixed(2) || '0',
      itemAmount: item.itemAmount?.toFixed(2) || '0',
      hcpc: data.linesInfo ? data.linesInfo[0].lines[index].hcpc : ''
    };
  });

  log.debug(orderLines);
  // Add the additional data
  const mergedOrderLines = {
    totalItemsAmount: data.lines.totalItemsAmount?.toFixed(2) || '0',
    totalAmount: data.lines.totalAmount?.toFixed(2) || '0',
    totalShipping: data.lines.totalShipping?.toFixed(2) || '0',
    totalTax: data.lines.totalTax?.toFixed(2) || '0',
    ...mergedLineUS,
    orderLines
  };

  log.debug(mergedOrderLines);
  return mergedOrderLines;
}

function filterAndSortByDate(array, days) {
  const DAYS = Number(days) * 24 * 60 * 60 * 1000; // days in milliseconds
  const now = new Date();

  return array
    .filter((item) => now - new Date(item.orderDate) <= DAYS) // Remove items older than the number of days
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)); // Sort in descending order
}

module.exports = {
  filterObjProperties,
  stringCompareIgnoreCase,
  getQueryPartyId,
  addCurrency,
  formatDate,
  mergeOrderHeadersData,
  mergeOrderLinesData,
  filterAndSortByDate,
  sanitiseString,
  isValidPathParameter
};

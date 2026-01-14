'use strict';

const _ = require('lodash');
const {log, utils} = require('../util/index.js');

function convertOrderHeaders(headers) {
  return headers.map((header) => {
    if (header) {
      const {
        LimitedOrderTaxesTotal,
        LimitedOrderChargesTotal,
        LimitedOrderLinesTotal,
        ...others
      } = header;

      let tally = utils.addCurrency(
        LimitedOrderTaxesTotal,
        LimitedOrderChargesTotal,
        2
      );
      tally = utils.addCurrency(tally, LimitedOrderLinesTotal, 2);
      return {
        ...others,
        LimitedOrderTaxesTotal,
        LimitedOrderChargesTotal,
        LimitedOrderLinesTotal,
        LimitedOrderTotal: tally
      };
    }
    return header;
  });
}

function convertOrderLines(orderLines, countryCode) {
  log.debug('ODataOrderConversion - convertOrderLines - orderLines: ');
  log.debug(orderLines);

  log.debug('ODataOrderConversion - convertOrderLines - countryCode: ');
  log.debug(countryCode);

  const lines = orderLines.lines;
  const status = orderLines.status;

  const topLineGroups = _.groupBy(lines, 'TopModelLineId');

  log.debug('ODataOrderConversion - convertOrderLines - topLineGroups: ');
  log.debug(topLineGroups);

  const nonCustomizableItems = topLineGroups[null] || [];
  delete topLineGroups[null];

  log.debug(
    'ODataOrderConversion - convertOrderLines - nonCustomizableItems: '
  );
  log.debug(nonCustomizableItems);

  const customizableItems = Object.getOwnPropertyNames(topLineGroups);

  log.debug('ODataOrderConversion - convertOrderLines - customizableItems: ');
  log.debug(customizableItems);

  //customizable item can contain many items
  //collapsedItem returns the top level items and tallies their pricing information.
  const collapsedItems = customizableItems.reduce((acc, propName) => {
    const customizableItem = topLineGroups[propName];

    const propLineId = Number.parseInt(propName);

    const collapsedItemTally = customizableItem.reduce(
      (top, line) => {
        //get top level orderLine
        top.item = propLineId === line.LineId ? line : top.item;

        //tally the UnitSellingPrice / TotalSellingPrice
        top.tallyUSP = utils.addCurrency(
          top.tallyUSP,
          line.UnitSellingPrice,
          2
        );
        top.tallyTSP = utils.addCurrency(
          top.tallyTSP,
          line.TotalSellingPrice,
          2
        );
        top.tallyTAX = utils.addCurrency(top.tallyTAX, line.TaxAmount || 0, 2);
        return top;
      },
      {item: {}, tallyUSP: 0, tallyTSP: 0, tallyTAX: 0}
    );

    //combine top level orderLine with tallies.
    const collapsedItem = {
      ...collapsedItemTally.item,
      UnitSellingPrice: collapsedItemTally.tallyUSP,
      TotalSellingPrice: collapsedItemTally.tallyTSP,
      TaxAmount: collapsedItemTally.tallyTAX
    };
    acc.push(collapsedItem);
    return acc;
  }, []);

  log.debug('ODataOrderConversion - convertOrderLines - collapsedItems: ');
  log.debug(collapsedItems);

  if (countryCode !== 'US') {
    return {
      orderLines: [...collapsedItems, ...nonCustomizableItems]
    };
  }

  return {
    orderStatus: status?.OrderStatus,
    orderType: status?.OrderType,
    orderCreationDate: status?.OrderCreationDate,
    gatheringDocStartedDate: status?.GathDocStartDate,
    insuranceAuthorisationStartedDate: status?.InsAuthStartDate,
    prepareShippingStartedDate: status?.PrepShipStartDate,
    shippedDate: status?.ShippedDate,
    shippingUrl: status?.ShippingUrl,
    lastUpdateDate: status?.LastUpdateDate,
    trackingNumber: status?.TrackingNumber,
    orderLines: [...collapsedItems, ...nonCustomizableItems]
  };
}

module.exports = {
  convertOrderHeaders,
  convertOrderLines
};

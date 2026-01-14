'use strict';

const {expect} = require('chai');
const {odataResponseMapper} = require('../../../src/mapper/index.js');

const oDataTwoCustOrderLinesStr = JSON.stringify(
  require('../../mock/oDataTwoCustOrderLines.json')
);
const oDataTwoCustOrderLinesConvertStr = JSON.stringify(
  require('../../mock/oDataTwoCustOrderLinesConvert.json')
);

const oDataTwoOneCustOrderLinesStr = JSON.stringify(
  require('../../mock/oDataTwoOneCustOrderLines.json')
);
const oDataTwoOneCustOrderLinesConvertStr = JSON.stringify(
  require('../../mock/oDataTwoOneCustOrderLinesConvert.json')
);

const oDataNonCustWithFrtOrderLinesStr = JSON.stringify(
  require('../../mock/oDataNonCustWithFrtOrderLines.json')
);
const oDataNonCustWithFrtOrderLinesConvertStr = JSON.stringify(
  require('../../mock/oDataNonCustWithFrtOrderLinesConvert.json')
);

describe('SUITE: oDataOrderConversion', () => {
  it('CASE: convertOrderLines collapses 2 customizable items, converts 129 order lines into 2 order lines with unitSellingPrice & totalSellingPrice sum.', () => {
    const orderLines = JSON.parse(oDataTwoCustOrderLinesStr).value;
    const result = odataResponseMapper.convertOrderLines({lines: orderLines});
    expect(result.orderLines).with.property('length').to.equal(2);
    expect(result).to.deep.equal(JSON.parse(oDataTwoCustOrderLinesConvertStr));
  });

  it('CASE: convertOrderLines collapses and returns 1 customizable item and 1 non customizable item with unitSellingPrice & totalSellingPrice sum.', () => {
    const orderLines = JSON.parse(oDataTwoOneCustOrderLinesStr).value;
    const result = odataResponseMapper.convertOrderLines({lines: orderLines});
    expect(result.orderLines).with.property('length').to.equal(2);
    expect(result).to.deep.equal(
      JSON.parse(oDataTwoOneCustOrderLinesConvertStr)
    );
  });

  it('CASE: convertOrderLines with 5 non customizable order lines (incl 1 frt), returns 5 order lines.', () => {
    const orderLines = JSON.parse(oDataNonCustWithFrtOrderLinesStr).value;
    const result = odataResponseMapper.convertOrderLines({lines: orderLines});
    expect(result.orderLines).with.property('length').to.equal(5);
    expect(result).to.deep.equal(
      JSON.parse(oDataNonCustWithFrtOrderLinesConvertStr)
    );
  });
});

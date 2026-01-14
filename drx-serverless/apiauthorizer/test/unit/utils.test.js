'use strict';

const getTokenValue = require('../../src/util/utils').getTokenValue;
const {expect} = require('chai');

describe('test utils.', () => {
  it('#getTokenValue.', () => {
    const token = getTokenValue('Bearer dummy');
    expect(token).not.be.null;
    expect(token).equal('dummy');
  });
});

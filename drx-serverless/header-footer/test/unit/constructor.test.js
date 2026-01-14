'use strict';

const {expect} = require('chai');

const constructor = require('../../src/constructor/responsePayloadConstructor');

describe('SUITE: constructor.', () => {
  it('CASE: check 200', async () => {
    try {
      constructor.getTokenExchangeResponse(200, {prop1: 'prop1'});

      expect(true).to.be.true;
    } catch (error) {
      console.log(error);
      expect(false).to.be.true;
    }
  });
});

'use strict';

const {colorConvert} = require('../../src/util/colorConvert');
const expect = require('chai').expect;

describe('colorConvert', () => {
  it('should get correct color from description', () => {
    const args = ['CP950', 'CP950 PROCESSING UNIT (SANDY BLONDE)'];
    const result = colorConvert(args);
    expect(result).equal('Sandy blonde');
  });
});

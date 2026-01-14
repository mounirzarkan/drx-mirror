'use strict';

const {expect} = require('chai');
const utils = require('../../../src/util/utils.js');

describe('SUITE: utils', () => {
  it("CASE: isValidName('hello') returns true ", () => {
    const result = utils.isValidName('hello');
    expect(result).to.equal(true);
  });

  it("CASE: isValidName('hello-hi') returns true ", () => {
    const result = utils.isValidName('hello');
    expect(result).to.equal(true);
  });

  it("CASE: isValidName('hello_hi') returns false ", () => {
    const result = utils.isValidName('hello_hi');
    expect(result).to.equal(false);
  });

  it("CASE: isValidName('h?llo') returns false ", () => {
    const result = utils.isValidName('h?llo');
    expect(result).to.equal(false);
  });

  it("CASE: isValidName('h*llo') returns false ", () => {
    const result = utils.isValidName('h*llo');
    expect(result).to.equal(false);
  });

  it("CASE: isValidName('h[ae]llo') returns false ", () => {
    const result = utils.isValidName('h[ae]llo');
    expect(result).to.equal(false);
  });

  it("CASE: isValidName('h[^e]llo') returns false ", () => {
    const result = utils.isValidName('h[^e]llo');
    expect(result).to.equal(false);
  });

  it("CASE: isValidName('h[a-b]llo') returns false ", () => {
    const result = utils.isValidName('h[a-b]llo');
    expect(result).to.equal(false);
  });
});

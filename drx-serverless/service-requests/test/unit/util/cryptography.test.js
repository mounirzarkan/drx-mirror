'use strict';

const {cryptography} = require('../../../src/util/index.js');
const {expect} = require('chai');
const key = 'ae593e40bd61aa293ab8daf094666d40a900a2de2df87b383711e03463d75fd8';

describe('SUITE: encrypt', () => {
  it('#encrypt', () => {
    const plainTest = 'hello world!';
    const encrypted = cryptography.encrypt(key, plainTest);
    expect(encrypted).not.null;
  });

  it('#decrypt', () => {
    const plainTest = 'hello world!';
    const encrypted = cryptography.encrypt(key, plainTest);
    expect(encrypted).not.null;
    expect(cryptography.decrypt(key, encrypted)).equal(plainTest);
  });
});

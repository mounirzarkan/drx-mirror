'use strict';

const {encrypt, decrypt} = require('../../src/util/encrypt');
const {expect} = require('chai');
const key = 'ae593e40bd61aa293ab8daf094666d40a900a2de2df87b383711e03463d75fd8';

describe('test encrypt.js', () => {
  it('#encrypt', () => {
    const plainTest = 'hello world!';
    const encrypted = encrypt(key, plainTest);
    expect(encrypted).not.null;
  });
  it('#decrypt', () => {
    const plainTest = 'hello world!';
    const encrypted = encrypt(key, plainTest);
    expect(encrypted).not.null;
    expect(decrypt(key, encrypted)).equal(plainTest);
  });
});

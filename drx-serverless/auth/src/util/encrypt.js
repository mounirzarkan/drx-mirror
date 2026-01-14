'use strict';

//AES-CBC encryption algorithm

const SimpleCrypto = require('simple-crypto-js').default;

let simpleCrypto;

function encrypt(key, text) {
  if (!simpleCrypto) {
    simpleCrypto = new SimpleCrypto(key);
  }
  return encodeURIComponent(simpleCrypto.encrypt(text));
}

function decrypt(key, cipher) {
  if (!simpleCrypto) {
    simpleCrypto = new SimpleCrypto(key);
  }
  return simpleCrypto.decrypt(decodeURIComponent(cipher));
}

module.exports = {
  encrypt,
  decrypt
};

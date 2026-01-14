'use strict';

const SimpleCrypto = require('simple-crypto-js').default;

function generate256SecretKey() {
  return SimpleCrypto.generateRandom(256);
}

console.log('256 secret: ', generate256SecretKey());

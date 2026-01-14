'use strict';

const {expect} = require('chai');
const {sanitize} = require('../../../src/validation/index.js');

describe('#Santize', () => {
  it('CASE : sanitize cleans dirtySchema ', () => {
    const dirtySchema = {
      a: 5555,
      b: '<script>alert("hello");</script>',
      c: {
        d: '<script>',
        e: 'hello,; : world--= :',
        f: 1077456
      },
      g: [
        '<script>alert("hello");</script> world',
        {
          h: 'hello <script>alert("world");</script>'
        }
      ]
    };
    sanitize.clean(dirtySchema);
    expect(dirtySchema).to.deep.equal({
      a: 5555,
      b: '',
      c: {d: '', e: 'hello,; : world--= :', f: 1077456},
      g: [' world', {h: 'hello '}]
    });
  });
});

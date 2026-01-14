'use strict';

const {expect} = require('chai');
const jwt = require('../../src/util/jwt');

describe('SUITE: jwt', () => {
  const jwtTokenUHdmStore = {'https://www.cochlear.com/app': 'uh,dm,store'};
  const jwtTokenUHStore = {'https://www.cochlear.com/app': 'uh,store'};
  const jwtTokenDM = {'https://www.cochlear.com/app': 'dm'};
  const emptyToken = {};

  it('jwt.containsAppClaim - searching for dm app - jwt with claim returns true', async () => {
    const result = jwt.containsAppClaim(jwtTokenUHdmStore, 'dm');
    expect(result).to.be.true;
  });
  it('jwt.containsAppClaim - searching for dm app - jwt with single app returns true', async () => {
    const result = jwt.containsAppClaim(jwtTokenDM, 'dm');
    expect(result).to.be.true;
  });

  it('jwt.containsAppClaim - searching for dm app - jwt without dm claim returns false', async () => {
    const result = jwt.containsAppClaim(jwtTokenUHStore, 'dm');
    expect(result).to.be.false;
  });
  it('jwt.containsAppClaim - searching for dm app - jwt without https://www.cochlear.com/app claim returns false', async () => {
    const result = jwt.containsAppClaim(emptyToken, 'dm');
    expect(result).to.be.false;
  });
});

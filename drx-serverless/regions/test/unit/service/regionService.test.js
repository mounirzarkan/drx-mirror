const {expect} = require('chai');
const {RegionService} = require('../../../src/service/index.js');

describe('SUITE: regionService', () => {
  let service = null;

  before(function () {
    const config = {
      scEndpoint: 'https://author.sit.cms.cochlear.cloud/api/cochlear',
      scApiKey: '%7BC373F5B9-AE6C-4E7B-B746-EEACB3D8EA0C%7D',

      geoNames: {
        username: 'mzarkan',
        //token: '',
        lan: 'en',
        encoding: 'JSON'
      },

      geoNamesLevels: {
        US: '2',
        CA: '2',
        GB: '3',
        IE: '3',
        NZ: '2',
        AU: '2',
        BE: '3'
      }
    };

    service = new RegionService(config);
  });

  it.skip('CASE: search.', async () => {
    const test = await service.search('CONT');
    console.log('TEST', test);
    expect(test).is.not.null;
  });

  it('CASE: get 51 regions for US.', async () => {
    const test = await service.retrieveCountryData('US', 'EN');

    expect((await test).country.code).to.equal('US');
    expect((await test).regions).to.have.length(51);
  }, 30000);

  it('CASE: get all countries.', async () => {
    var test = await service.retrieveCountryData('', 'EN');
    expect(test).to.have.length(250);
  }, 30000);

  it('CASE: get 13 regions for CA.', async () => {
    const test = await service.retrieveCountryData('CA', 'EN');

    expect((await test).country.code).to.equal('CA');
    expect((await test).regions).to.have.length(13);
  }, 30000);

  it('CASE: get 78 regions for PR.', async () => {
    const test = await service.retrieveCountryData('PR', 'EN');

    expect((await test).country.code).to.equal('PR');
    expect((await test).regions).to.have.length(78);
  }, 30000);

  it('CASE: get 8 regions for AU.', async () => {
    const test = await service.retrieveCountryData('AU', 'EN');

    expect((await test).country.code).to.equal('AU');
    expect((await test).regions).to.have.length(8);
  }, 30000);

  it('CASE: get 17 regions for NZ.', async () => {
    const test = await service.retrieveCountryData('NZ', 'EN');

    expect((await test).country.code).to.equal('NZ');
    expect((await test).regions).to.have.length(17);
  }, 30000);

  it('CASE: get 31 regions for IE.', async () => {
    const test = await service.retrieveCountryData('IE', 'EN');

    expect((await test).country.code).to.equal('IE');
    expect((await test).regions).to.have.length(31);
  }, 30000);

  it('CASE: IE name & abbr match.', async () => {
    const test = await service.retrieveCountryData('IE', 'EN');
    const isMatch = test.regions.every(({name, abbr}) => name === abbr);
    expect(isMatch).to.be.true;
  }, 30000);

  it('CASE: get 184 regions for UK.', async () => {
    const test = await service.retrieveCountryData('GB', 'EN');

    expect((await test).country.code).to.equal('GB');
    expect((await test).regions).to.have.length(184);
  }, 30000);

  it('CASE: GB name & abbr match.', async () => {
    const test = await service.retrieveCountryData('GB', 'EN');
    const isMatch = test.regions.every(({name, abbr}) => name === abbr);
    expect(isMatch).to.be.true;
  }, 30000);

  it('CASE: get 4 regions for BE.', async () => {
    const test = await service.retrieveCountryData('BE', 'EN');

    expect((await test).country.code).to.equal('BE');
    expect((await test).regions).to.have.length(11);
  }, 30000);

  it('CASE: get 4 regions for AU', async () => {
    const test = await service.retrieveCountryData('AU', 'EN');

    expect((await test).country.code).to.equal('AU');
    expect((await test).regions).to.have.length(8);
  }, 30000);

  // TODO commented these tests out as they're integration tests that are calling sitecore
  // which is currently broken!
  it.skip('CASE: get 4 regions for AU (SC)', async () => {
    const test = await service.retrieveCountryData('AU', 'EN', 'sc');

    expect((await test).country.code).to.equal('AU');
    expect((await test).regions).to.have.length(2);
  });

  it.skip('CASE: get 4 regions for cn (SC)', async () => {
    const test = await service.retrieveCountryData('CN', 'EN', 'sc');

    expect((await test).country.code).to.equal('CN');
    expect((await test).regions).to.have.length(34);
  });
});

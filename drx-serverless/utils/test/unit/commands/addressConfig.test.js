'use strict';

const {expect} = require('chai');
const GetAddressConfigCommand = require('../../../src/commands/getAddressConfigCommand');

// TODO skipped these tests, as they're integration tests (need to use sinon to mock out the calls)
// They also don't work!
describe.skip('SUITE: AddressConfig', () => {
  it('CASE : US', async () => {
    const sc_endpoint = 'https://author.sit.cms.cochlear.cloud/api/cochlear';
    const sc_apikey = '%7BC373F5B9-AE6C-4E7B-B746-EEACB3D8EA0C%7D';
    const isScHttpAgent = false;

    const cmd = new GetAddressConfigCommand(
      sc_endpoint,
      sc_apikey,
      isScHttpAgent
    );

    const data = await cmd.execute('us', 'en');
    console.log(data);

    expect(data).to.have.property('foundation');
    expect(data).to.have.property('adaptiveForm');
    expect(data.foundation.config.country).to.equal('US');
    expect(data.foundation).to.have.property('config');
    expect(data.foundation).to.have.property('regions');
    expect(data.foundation.regions).to.have.length(51);
  });

  it('CASE : IT', async () => {
    const sc_endpoint = 'https://author.sit.cms.cochlear.cloud/api/cochlear';
    const sc_apikey = '%7BC373F5B9-AE6C-4E7B-B746-EEACB3D8EA0C%7D';
    const isScHttpAgent = false;

    const cmd = new GetAddressConfigCommand(
      sc_endpoint,
      sc_apikey,
      isScHttpAgent
    );

    const data = await cmd.execute('it', 'en');
    console.log(data);

    expect(data).to.have.property('foundation');
    expect(data).to.have.property('adaptiveForm');
    expect(data.foundation.config.country).to.equal('IT');
    expect(data.foundation).to.have.property('config');
    expect(data.foundation).to.have.property('regions');
    expect(data.foundation.regions).to.have.length(107);
  });
});

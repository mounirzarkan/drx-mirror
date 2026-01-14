'use strict';

const should = require('should');
const handler = require('../../src/handler');

describe.skip('SUITE: handler.', () => {
  it('CASE: headerfooter returns HTTP200.', async () => {
    const event = {
      queryStringParameters: {
        lng: 'en',
        country: 'us'
      }
    };
    const resp = await handler.getHeaderFooter(event);
    should(resp.statusCode).be.exactly(200);
  });
});

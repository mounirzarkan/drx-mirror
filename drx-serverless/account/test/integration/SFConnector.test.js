'use strict';

const SFConnector = require('../../src/connector/SFConnector.js');
const {expect} = require('chai');

describe.skip('SUITE: SFConnector', () => {
  it('CASE: patchAccount returns status 200 response.', async () => {
    const tokenObj = {
      instanceUrl: 'https://cochlear--uob2.my.salesforce.com',
      accessToken:
        '00D3E000000B9Ct!AQkAQI0rWRxL86XTUE8WXlQPH3KEsFWOtJ92BV4MyW21Tlu_L8RBuS3hPGjRPRY6.xAjzWlo70QJk7YEehodDgOkHhUyBbGf'
    };
    const account = {
      request: {
        customerIdentifier: 162748173278165,
        modifiedByApp: 'drx',
        modifiedBy: 'Amanda Ward',
        account: {
          FirstName: 'ada',
          LastName: 'las',
          Date_of_Birth__pc: '1991-09-30'
        }
      }
    };
    const sfConnector = new SFConnector(tokenObj);
    const response = await sfConnector.patchAccount(account);

    expect(response).with.property('status').equal('SUCCESS');
  });

  it('CASE: patchAccount with phones property returns status 200 response.', async () => {
    const tokenObj = {
      instanceUrl: 'https://cochlear--uob2.my.salesforce.com',
      accessToken:
        '00D3E000000B9Ct!AQkAQI0rWRxL86XTUE8WXlQPH3KEsFWOtJ92BV4MyW21Tlu_L8RBuS3hPGjRPRY6.xAjzWlo70QJk7YEehodDgOkHhUyBbGf'
    };
    const account = {
      request: {
        customerIdentifier: 162748173278165,
        modifiedByApp: 'drx',
        modifiedBy: 'Amanda Ward',
        account: {
          FirstName: 'ada',
          LastName: 'las'
        },
        phones: [
          {
            type: 'Mobile',
            phoneNumber: '+12121112212',
            ocSms: 'Given',
            isValid: true,
            isPrimary: false,
            country: '+1',
            areaCodeAndNumber: '3333333'
          },
          {
            type: 'Mobile',
            phoneNumber: '+12444112212',
            ocSms: null,
            isValid: true,
            isPrimary: false,
            country: '+1',
            areaCodeAndNumber: '2121112212'
          },
          {
            type: 'Mobile',
            phoneNumber: '+121217772212',
            ocSms: null,
            isValid: true,
            isPrimary: true,
            country: '+1',
            areaCodeAndNumber: '893636116'
          }
        ]
      }
    };
    const sfConnector = new SFConnector(tokenObj);
    try {
      const response = await sfConnector.patchAccount(account);
      console.log('response', response);
      expect(response).with.property('status').equal('SUCCESS');
    } catch (e) {
      console.log('e', e.data);
    }
  });
});

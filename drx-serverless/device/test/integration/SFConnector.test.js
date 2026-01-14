'use strict';

// const sf = require('jsforce');
const {SFConnector} = require('../../src/connector/index.js');
const axios = require('axios');
/*
const creds = {
  hostname: 'test.salesforce.com',
  clientSecret: '44FEEB98C23CC9FB5167502EA416877EB1CFFA62C530ABA640F14E4462F243D5',
  clientId: '3MVG9lcxCTdG2VbsqxQTts6rxd0n4oKNExazvmWePoEkinqYfh6nz96XNO3ZKO6JyZyGt9C8YxYVHQuFdZ0tT',
  username: 'digitalrefresh_int@cochlear.com.uob',
  password: 'D1g1talR3fr3%%',
  secretToken: '1ylYIulgy4yvrdIE12S0YJE4',
};

const conn = SFConnector.loginConnect(sf, creds);
console.log(conn);

const token = SFConnector.getToken(conn, creds);
token.then(value => console.log(value)).catch(value => console.log(value));

const conn = SFConnector.tokenConnect(sf, { accessToken: '00D9E000000Cz8Z!ARsAQAYSYhUZfIihw91ANHkKlhbSEZipyb2xj1jHC7XigoU_thQLveikq2OJER1nONYt9acwNyeS8sx_kk3B8YotrPRW_5Go', instanceUrl: 'https://cochlear--UOB.cs88.my.salesforce.com' });
const cochlear_id = '176815878606179-';
try {
  const resp = SFConnector.getDevicesList(conn, cochlear_id);
  resp.then(console.log).catch(reject => {
    console.log('%%%%%: ', reject);
    console.log('-----------------');
    console.dir(reject);
    console.log('--------------');
    console.log(JSON.stringify(reject));
  });
} catch (err) {
  console.log('*******', err);
}
*/

const cochlear_id = '176815878606179';
const instanceUrl = 'https://cochlear--UOB.cs88.my.salesforce.com';
const token =
  '00D9E000000Cz8Z!ARsAQE7NtUvjgymHkk573XB4LMS01j6wslz4clAH4mIL_Ryjnlg21RsMic9GwiEnvxb47v722WZMhVGw_0Y45LrIH5x3ICeF---';

const loggedinToken = `{"accessToken" : "${token}", "instanceUrl" : "${instanceUrl}" }`;

SFConnector.getDevicesList(axios, cochlear_id, JSON.parse(loggedinToken))
  .then((resp) => console.log(resp.data))
  .catch((err) => {
    console.log(err);
    /*
    console.log('-----*************************************');
    console.dir(err);
    console.log('*************************************----');
    console.log(Object.getOwnPropertyDescriptors(err));
    console.log('-------------------');
    console.dir(err.response);
    console.log('------------');
    console.dir(err.response.data);
    console.log(err.response.status);
    console.log('------------');
    console.log(err.stack);
    console.log('------------');
    console.log(err.message);
    console.log('------------');
    console.log(err.config);
    console.log('------------');
    console.log(err.request);
    console.log('------------');
    console.log(err.response);
    console.log('------------');
    console.log(err.isAxiosError);
    console.log('------------');
    console.log(typeof err);
    console.log(err.toJSON);
    */
    // console.log(err.isAxiosError);
    // console.log(err.response.status);
    // console.log(err.response.data);
  });

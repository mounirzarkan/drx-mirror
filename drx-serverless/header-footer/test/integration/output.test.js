// 'use strict';

// const {expect} = require('chai');

// const BuildContractCommand = require('../../src/commands/buildContractCommand.js');

// describe.skip('SUITE: test sitecore', () => {
//   it.skip('CASE: test output US ', async () => {
//     let config = {
//       _Environment: 'dev',
//       _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
//       _aws_secret: {
//         sc_apikey: '',
//         scp_env_username: '',
//         scp_env_password: ''
//       }
//     };

//     const command = new BuildContractCommand(config);
//     const resp = await command.execute('en', 'us');
//     console.log('resp', JSON.stringify(resp));
//   });

//   it.skip('CASE: test output AU ', async () => {
//     let config = {
//       _Environment: 'dev',
//       _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
//       _aws_secret: {
//         sc_apikey: '',
//         scp_env_username: '',
//         scp_env_password: ''
//       }
//     };

//     const command = new BuildContractCommand(config);
//     const resp = await command.execute('en', 'au');
//     console.log('command.execute resp: ', JSON.stringify(resp));

//     const expectedResponse = require('../mock/lambdaAUresponse.json');

//     expect(resp).to.deep.equal(expectedResponse);
//     //expect(uc.source == "sitecore" && uc.configUrls.COCHLEAR_COOKIE_DOMAIN != "").to.be.true;
//   });

//   it.skip('CASE: test output CA ', async () => {
//     let config = {
//       _Environment: 'dev',
//       _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
//       _aws_secret: {
//         sc_apikey: '',
//         scp_env_username: '',
//         scp_env_password: ''
//       }
//     };

//     const command = new BuildContractCommand(config);
//     const resp = await command.execute('en', 'ca');
//     console.log('command.execute resp: ', JSON.stringify(resp));

//     const expectedResponse = require('../mock/lambdaUSresponse.json');

//     expect(resp).to.deep.equal(expectedResponse);
//     //expect(uc.source == "sitecore" && uc.configUrls.COCHLEAR_COOKIE_DOMAIN != "").to.be.true;
//   });

//   it('CASE: test output UK ', async () => {
//     let config = {
//       _Environment: 'dev',
//       _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
//       _aws_secret: {
//         sc_apikey: '',
//         scp_env_username: '',
//         scp_env_password: ''
//       }
//     };

//     const command = new BuildContractCommand(config);
//     const resp = await command.execute('en', 'uk');
//     console.log('command.execute resp: ', JSON.stringify(resp));

//     const expectedResponse = require('../mock/lambdaUKresponse.json');

//     expect(resp).to.deep.equal(expectedResponse);
//   });

//   it('CASE: test output NZ ', async () => {
//     let config = {
//       _Environment: 'dev',
//       _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
//       _aws_secret: {
//         sc_apikey: '',
//         scp_env_username: '',
//         scp_env_password: ''
//       }
//     };

//     const command = new BuildContractCommand(config);
//     const resp = await command.execute('en', 'nz');
//     console.log('command.execute resp: ', JSON.stringify(resp));

//     const expectedResponse = require('../mock/lambdaUSresponse.json');

//     expect(resp).to.deep.equal(expectedResponse);
//     //expect(uc.source == "sitecore" && uc.configUrls.COCHLEAR_COOKIE_DOMAIN != "").to.be.true;
//   });

//   it('command.execute When basic scp_env_username or scp_env_password is empty, make request without basic auth throws 401 error', async () => {
//     let config = {
//       _Environment: 'dev',
//       _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
//       _aws_secret: {
//         sc_apikey: '',
//         scp_env_username: '',
//         scp_env_password: ''
//       }
//     };

//     const command = new BuildContractCommand(config);
//     let errorMessage = undefined;
//     try {
//       await command.execute('en', 'uk');
//     } catch (error) {
//       if (error && error.response) {
//         errorMessage = error.response.status;
//       }
//     }
//     expect(errorMessage).to.equal(401);
//   });
// });

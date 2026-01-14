const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const { log } = require('../util/index.js');

class WebCaseLambdaConnector {
  constructor(params) {
    console.log('=====> WebCaseLambdaConnector: constructor');
    console.log('=====> WebCaseLambdaConnector: region = ' + params.region);
    this.env = params.env;
    this.lambdaClient = new LambdaClient({ region: params.region });
  }

  async createWebCase(sfWebCaseData) {
    log.debug(
      '=====> WebCaseLambdaConnector, createEnquiryWebCase - sfWebCaseData:'
    );
    log.debug(sfWebCaseData);
    const params = {
      FunctionName: `drx-webcase-lambda-${this.env}-WebCase`,
      InvocationType: 'RequestResponse',
      Payload: Buffer.from(JSON.stringify(sfWebCaseData)),
    };

    const command = new InvokeCommand(params);
    const resp = await this.lambdaClient.send(command);

    log.debug(
      '=====> WebCaseLambdaConnector, createEnquiryWebCase - resp.Payload:'
    );
    // resp.Payload is a Uint8Array, convert to string
    const payloadString = Buffer.from(resp.Payload).toString();
    log.debug(payloadString);
    return JSON.parse(payloadString);
  }
}

module.exports = WebCaseLambdaConnector;
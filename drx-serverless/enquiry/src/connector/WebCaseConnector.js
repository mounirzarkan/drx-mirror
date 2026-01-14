const axios = require('axios');
const {log} = require('../util/index.js');

class WebCaseConnector {
  constructor(params) {
    console.log('=====> WebCaseConnector: constructor');
    console.log('=====> WebCaseConnector: cochlearApiDomain = ' + params.cochlearApiDomain);
    this.connection = axios.create({
      baseURL: params.cochlearApiDomain,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

async createEnquiryWebCase(sfWebCaseData) {
    log.debug('=====> WebCaseConnector, createEnquiryWebCase - sfWebCaseData:');
    log.debug(sfWebCaseData);

    // console.time('SF-webToCase start');
    const resp = await this.connection.post(
      `/drx/v1/webcase`,
      sfWebCaseData
    );
    // console.time('SF-webToCase end');

    log.debug('=====> WebCaseConnector, createEnquiryWebCase - resp.data:');
    log.debug(resp.data);
    return resp.data;
  }

}

module.exports = WebCaseConnector;

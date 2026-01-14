const axios = require('axios');
const {log} = require('../util/index.js');

class WebCaseConnector {
  constructor(params) {
    console.log('=====> WebCaseConnector: constructor');
    this.connection = axios.create({
      baseURL: 'https://sit.api.cochlear.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

async printIfus(sfWebCaseData) {
    log.debug('=====> WebCaseConnector, printIfus - sfWebCaseData:');
    log.debug(sfWebCaseData);

    // console.time('SF-webToCase start');
    const resp = await this.connection.post(
      `/drx/v1/webcase`,
      sfWebCaseData
    );
    // console.time('SF-webToCase end');

    log.debug('=====> WebCaseConnector, printIfus - resp.data:');
    log.debug(resp.data);
    return resp.data;
  }

}

module.exports = WebCaseConnector;

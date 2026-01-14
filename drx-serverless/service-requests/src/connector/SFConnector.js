'use strict';

const axios = require('axios');

// Placeholder if required in future
class SFConnector {
  constructor({instanceUrl, accessToken}) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
    this.connection = axios.create({
      baseURL: instanceUrl,
      headers: {Authorization: `Bearer ${this.accessToken}`}
    });
  }
}

module.exports = SFConnector;

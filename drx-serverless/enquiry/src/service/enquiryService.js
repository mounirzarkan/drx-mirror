'use strict';

const {log, utils} = require('../util/index.js');
const connectors = require('../connector/index.js');

class EnquiryService {
  constructor(config) {
    this.config = config;
  }

  async createEnquiryWebCase(formData) {
    log.debug('=====> EnquiryService, createEnquiryWebCase');

    let sfWebCaseData = {
      ...formData,
      ...(formData.reason
        ? {
            reason: formData.reason,
            subject:
              formData.subject || `Contact Us submission: ${formData.reason}`
          }
        : {
            subject: `Contact Us submission: ${formData.subject}`,
            reason: formData.subject
          }),
      firstNameLocal: formData.firstNameLocal || '',
      lastNameLocal: formData.lastNameLocal || '',
      debugEmail: formData.debugEmail || formData.email
    };

    const {WebCaseLambdaConnector} = connectors;
    const webCaseLambdaConnector = new WebCaseLambdaConnector(this.config);

    const response = await webCaseLambdaConnector.createWebCase(sfWebCaseData);

    return response;
  }
}

module.exports = EnquiryService;

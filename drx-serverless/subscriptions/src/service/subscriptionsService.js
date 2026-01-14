'use strict';

const {log, utils} = require('../util/index.js');
const connectors = require('../connector/index.js');
const {last} = require('lodash');

//TODO: Use config for domain
const DOMAIN_COCHLEAR_ASSETS = 'https://assets.cochlear.com';
class SubscriptionsService {
  constructor(config) {
    this.config = config;
  }

  async subscribeMicBatt(formData) {
    log.debug('=====> SubscriptionsService, subscribeMicBatt');

    const {
      firstName,
      lastName,
      email,
      phone = '',
      country,
      debugEmail = '',
      HealthCloudGA__SourceSystem__c
    } = formData;

    const sfWebCaseData = {
      firstName,
      lastName,
      email,
      phone,
      country,
      subject: 'Battery Microphone Subscription',
      isSFHC: true,
      debugEmail,
      description: this.constructDescription(formData),
      HealthCloudGA__SourceSystem__c
    };

    const {WebCaseLambdaConnector} = connectors;
    const webCaseLambdaConnector = new WebCaseLambdaConnector(this.config);

    const response = await webCaseLambdaConnector.createWebCase(
      sfWebCaseData
    );

    return response;
  }

  constructDescription(formData) {
    const description = `Description: Battery Microphone Cover Subscription\n
                          Desired Service: ${formData.desiredService}\n
                          Personal Details:
                          Name: ${formData.firstName} ${formData.lastName}
                          DOB: ${formData.dateOfBirth}
                          Email: ${formData.email}\n

                          Address:
                          ${formData.streetHouseNumber}
                          ${formData.city}
                          ${formData.postcode}
                          ${formData.country}\n

                          Sound processor details:
                          ${formData.whichEar}\n
                          Left:
                          ${formData.soundProcessorModelLeftSide ?? ''}
                          ${formData.soundProcessorColorLeftSide_1 ?? formData.soundProcessorColorLeftSide_2 ?? ''}\n
                          Right:
                          ${formData.soundProcessorModelRightSide ?? ''}
                          ${formData.soundProcessorColorRightSide_1 ?? formData.soundProcessorColorRightSide_2 ?? ''}\n

                          Health insurance details:
                          ${formData.healthInsuranceNameRegisteredOffice}
                          ${formData.healthInsuranceNumber}\n
                          
                          Delivery details:
                          ${formData.deliveryFirstName ?? formData.firstName}
                          ${formData.deliveryLastName ?? formData.lastName}
                          ${formData.deliveryStreetHouseNumber ??
                            formData.streetHouseNumber}
                          ${formData.deliveryCity ?? formData.city}
                          ${formData.deliveryPostcode ?? formData.postcode}
                          ${formData.deliveryCountry ?? formData.country} \n`;
    return description;
  }
}

module.exports = SubscriptionsService;

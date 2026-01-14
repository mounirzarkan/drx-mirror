'use strict';

const {log} = require('../util/index.js');
const connectors = require('../connector/index.js');
const {pick} = require('lodash');

//TODO: Use config for domain
const DOMAIN_COCHLEAR_ASSETS = 'https://assets.cochlear.com';
class LossClaimsService {
  constructor(config) {
    this.config = config;
  }

  async submitLossClaim(formData) {
    log.debug('=====> LossClaimsService, submitLossClaim');

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
      subject: 'Digital Loss claims form',
      isSFHC: true,
      debugEmail,
      description: this.constructDescription(formData),
      HealthCloudGA__SourceSystem__c,
      ...pick(formData, [
        'utmCampaign',
        'utmContent',
        'utmCreativeFormat',
        'utmId',
        'utmMarketingTactic',
        'utmMedium',
        'utmSource',
        'utmSourcePlatform',
        'utmTerm',
        'googleAnalyticsClientId',
        'facebookId',
        'webformUrl'
      ])
    };

    const {WebCaseLambdaConnector} = connectors;
    const webCaseLambdaConnector = new WebCaseLambdaConnector(this.config);

    const response = await webCaseLambdaConnector.createWebCase(sfWebCaseData);

    return response;
  }

  constructDescription(formData) {
    const description = [
      '01 Patient information:',
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Address:`,
      formData.address,
      formData.city,
      formData.country === 'US' ? formData.stateUS : undefined,
      formData.country === 'CA' ? formData.stateCA : undefined,
      formData.postalCode,
      formData.country,
      `Date of birth: ${
        formData.relationship === 'Self'
          ? formData.dateOfBirthSelf
          : formData.dateOfBirthCarerClinician
      }`,
      formData.country === 'US'
        ? `Preferred language: ${formData.languagePreference}`
        : undefined,
      '',
      '02 Clinic information:',
      `Clinic name: ${
        formData.relationship === 'Clinician'
          ? formData.clinicName2
          : formData.clinicName
      }`,
      `Clinic email: ${
        formData.relationship === 'Clinician'
          ? formData.email2
          : formData.clinicEmail
      }`,
      `Audiologist name: ${
        formData.relationship === 'Clinician'
          ? `${formData.firstName2} ${formData.lastName2}`
          : formData.audiologistName
      }`,
      '',
      '03 Information about the product being claimed:',
      `Sound processor: ${formData.soundProcessor}`,
      `Model: ${formData.nucleusModel ??
        formData.kansoModel ??
        formData.bahaModel ??
        formData.osiaModel ??
        'N/A'}`,
      `Serial number: ${formData.serialNumber ?? 'N/A'}`,
      `Ear side of sound processor being claimed: ${formData.earSide ?? 'N/A'}`,
      formData.soundProcessor === 'Nucleus / Nucleus Nexa Sound Processor'
        ? `Coil/cable length: ${formData.nucleusCoilCableLength ?? 'N/A'}`
        : undefined,
      formData.soundProcessor === 'Baha Sound Processor'
        ? `Coil/cable length: ${formData.bahaCoilCableLength ?? 'N/A'}`
        : undefined,

      // Kanso
      ...(formData.soundProcessor === 'Kanso / Kanso Nexa Sound Processor'
        ? [
            `Magnet strength: ${formData.nucleusKansoMagnetStrength ?? 'N/A'}`,
            `(I) Magnet strength: ${formData.nucleusKansoIMagnetStrength ??
              'N/A'}`,
            `Other items being claimed: ${
              formData.kansoOtherItems
                ? `\n${formData.kansoOtherItems
                    .split(';')
                    .map(item => `- ${item}`)
                    .join('\n')}`
                : 'N/A'
            }`
          ]
        : []),

      // Osia
      ...(formData.soundProcessor === 'Osia Sound Processor' &&
      formData.osiaModel === 'Osia 2'
        ? [`Magnet strength (Osia 2): ${formData.osia2MagnetStrength ?? 'N/A'}`]
        : []),
      ...(formData.soundProcessor === 'Osia Sound Processor' &&
      formData.osiaModel === 'Osia 2(I)'
        ? [
            `Magnet strength (Osia 2(I)): ${formData.osia2IMagnetStrength ??
              'N/A'}`
          ]
        : []),
      ...(formData.soundProcessor === 'Osia Sound Processor'
        ? [
            `Other items being claimed: ${
              formData.osiaOtherItems
                ? `\n${formData.osiaOtherItems
                    .split(';')
                    .map(item => `- ${item}`)
                    .join('\n')}`
                : 'N/A'
            }`
          ]
        : []),

      // Nucleus
      ...(formData.soundProcessor === 'Nucleus / Nucleus Nexa Sound Processor'
        ? [
            `Magnet strength: ${formData.nucleusKansoMagnetStrength ?? 'N/A'}`,
            `(I) Magnet strength: ${formData.nucleusKansoIMagnetStrength ??
              'N/A'}`,
            `Earhook size: ${formData.nucleusEarhookSize ?? 'N/A'}`,
            formData.nucleusModel === 'Nucleus 7'
              ? `Battery type: ${formData.nucleus7BatteryType ?? 'N/A'}`
              : undefined,
            formData.nucleusModel === 'Nucleus 8' ||
            formData.nucleusModel === 'Nucleus 8 Nexa'
              ? `Battery type: ${formData.nucleus8BatteryType ?? 'N/A'}`
              : undefined,
            `Other items being claimed: ${
              formData.nucleusOtherItems
                ? `\n${formData.nucleusOtherItems
                    .split(';')
                    .map(item => `- ${item}`)
                    .join('\n')}`
                : 'N/A'
            }`
          ]
        : []),

      // Baha
      ...(formData.soundProcessor === 'Baha Sound Processor'
        ? [
            `Magnet strength: ${formData.bahaMagnetStrength ?? 'N/A'}`,
            `Earhook size: ${formData.bahaEarhookSize ?? 'N/A'}`,
            `Battery type: ${formData.bahaBatteryType ?? 'N/A'}`,
            `Baha® Softband (if applicable): ${formData.bahaBahaSoftband}`,
            `Softband (if applicable): ${formData.bahaSoftband}`,
            `SoundArc (if applicable): ${formData.bahaSoundArc}`,
            `Other items being claimed: ${
              formData.bahaOtherItems
                ? `\n${formData.bahaOtherItems
                    .split(';')
                    .map(item => `- ${item}`)
                    .join('\n')}`
                : 'N/A'
            }`
          ]
        : []),

      '',
      `04 Explanation of loss: ${formData.explanationOfLoss}`,
      '',
      `05 Shipping details:`,
      ...(formData.deliveryMethod === 'Ship to a different address'
        ? [
            formData.deliveryAddress,
            formData.deliveryCity,
            formData.deliveryCountry === 'US'
              ? formData.deliveryStateUS
              : undefined,
            formData.deliveryCountry === 'CA'
              ? formData.deliveryStateCA
              : undefined,
            formData.deliveryPostalCode,
            formData.deliveryCountry
          ]
        : [
            formData.address,
            formData.city,
            formData.country === 'US' ? formData.stateUS : undefined,
            formData.country === 'CA' ? formData.stateCA : undefined,
            formData.postalCode,
            formData.country
          ]),
      '',
      '06 Submitted by:',
      `Relationship to patient: ${formData.relationship}`,
      ...(formData.relationship === 'Self'
        ? [
            `Name: ${formData.firstName} ${formData.lastName}`,
            `Email: ${formData.email}`
          ]
        : [
            `Name: ${formData.firstName2} ${formData.lastName2}`,
            `Email: ${formData.email2}`
          ]),
      '',
      '07 Consent:',
      `Consent to receive calls or text messages related to their order: ${
        formData.contactConsentCheckbox === 'true' ? 'Given' : 'Not given'
      }`
    ]
      .filter(a => a !== undefined)
      .join('\n');

    return description;
  }
}

module.exports = LossClaimsService;

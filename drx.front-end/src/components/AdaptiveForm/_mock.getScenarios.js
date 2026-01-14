import {
  formViewConfig,
  formViewConfig_readOnly,
  formViewConfig_AU,
  formViewConfig_readOnly_AU,
  addressAndContactConfig,
} from './FormView/_mock';
import {
  addressConfig_US,
  addressConfig_US_readOnly,
} from './AddressView/_mock';
import {
  phoneNumbersViewConfig,
  phoneNumbersViewConfig_readOnly,
  carersViewConfig_readOnly,
  phoneNumbersViewNoOcSmsConfig_readOnly,
  phoneNumbersViewNoOcSmsConfig,
} from './ListView/_mock';

function getScenarios(temporaryLocalization) {
  //const response =
  return {
    formConfig: {
      tabConfigs: [
        // Config A-1 : carer viewing complex recipient
        {
          tabType: 'recipient',
          userType: 'carer',
          userAgeGroup: 'not applicable',
          addressRestricted: true,
          hasCarer: false,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig
                : formViewConfig_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title: 'aboutMe.editActionBar.personal.title.label',
              fallbackTitle:
                'aboutMe.editActionBar.personal.fallbackTitle.label',
            },
            {
              ...addressAndContactConfig,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },
        // Config A-2 : carer viewing simple recipient
        {
          tabType: 'recipient',
          userType: 'carer',
          userAgeGroup: 'not applicable',
          addressRestricted: false,
          hasCarer: false,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig
                : formViewConfig_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title: 'aboutMe.editActionBar.personal.title.label',
              fallbackTitle:
                'aboutMe.editActionBar.personal.fallbackTitle.label',
            },
            {
              ...addressConfig_US,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
              'us'
                ? phoneNumbersViewConfig
                : phoneNumbersViewNoOcSmsConfig),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },
        // Config B : carer viewing themselves
        {
          tabType: 'carer',
          userType: 'carer',
          userAgeGroup: 'not applicable',
          addressRestricted: false,
          hasCarer: false,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig
                : formViewConfig_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title:
                'aboutMe.editActionBar.personal.carerTitle.label',
            },
            {
              ...addressConfig_US,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
              'us'
                ? phoneNumbersViewConfig
                : phoneNumbersViewNoOcSmsConfig),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },
        // Config C-1 : Recipient with carer is able to edit
        {
          tabType: 'recipient',
          userType: 'recipient',
          userAgeGroup: 'older than update age',
          addressRestricted: false,
          hasCarer: true,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig
                : formViewConfig_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title:
                'aboutMe.editActionBar.personal.recipientTitle.label',
            },
            {
              ...addressConfig_US,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
              'us'
                ? phoneNumbersViewConfig
                : phoneNumbersViewNoOcSmsConfig),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...carersViewConfig_readOnly,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },
        // Config C-2 : Recipient with carer is not able to edit
        {
          tabType: 'recipient',
          userType: 'recipient',
          userAgeGroup: 'younger than update age',
          addressRestricted: false,
          hasCarer: true,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig_readOnly
                : formViewConfig_readOnly_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title:
                'aboutMe.editActionBar.personal.recipientTitle.label',
            },
            {
              ...addressConfig_US_readOnly,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
              'us'
                ? phoneNumbersViewConfig_readOnly
                : phoneNumbersViewNoOcSmsConfig_readOnly),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...carersViewConfig_readOnly,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },

        // Config D-1 : Recipient without carer is able to edit
        {
          tabType: 'recipient',
          userType: 'recipient',
          userAgeGroup: 'older than update age',
          addressRestricted: false,
          hasCarer: false,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig
                : formViewConfig_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title:
                'aboutMe.editActionBar.personal.recipientTitle.label',
            },
            {
              ...addressConfig_US,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
              'us'
                ? phoneNumbersViewConfig
                : phoneNumbersViewNoOcSmsConfig),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },
        // Config D-2 : Recipient without carer is not able to edit
        {
          tabType: 'recipient',
          userType: 'recipient',
          userAgeGroup: 'younger than update age',
          addressRestricted: false,
          hasCarer: false,
          sections: [
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
                'us' ||
              temporaryLocalization?.countryCode?.toLowerCase() ===
                'pr'
                ? formViewConfig_readOnly
                : formViewConfig_readOnly_AU),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
              mask: temporaryLocalization.mask,
              title:
                'aboutMe.editActionBar.personal.recipientTitle.label',
            },
            {
              ...addressConfig_US_readOnly,
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
            {
              ...(temporaryLocalization?.countryCode?.toLowerCase() ===
              'us'
                ? phoneNumbersViewConfig_readOnly
                : phoneNumbersViewNoOcSmsConfig_readOnly),
              country: temporaryLocalization.countryCode,
              language: temporaryLocalization.locale,
            },
          ],
        },
      ],
    },
  };
}

function temporaryMaskConvert(countryCode) {
  if (countryCode === 'PR' || countryCode === 'US') {
    return 'mmmm dd yyyy';
  }
  return 'dd mmmm yyyy';
}

export { temporaryMaskConvert, getScenarios };

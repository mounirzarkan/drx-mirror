import { adaptiveFormsQuery } from '../../../gql/adaptiveFormsQuery.mock';
import { mapTabScenarios } from '../../../utils/adaptiveForm/mapTabScenarios';
import {
  AU_personal,
  US_addressAndContactConfig,
  US_personal,
} from '../_mock';

export const formData = {
  _metadata: {
    readOnlyForm: false,
  },
  firstName: {
    value: 'Adrienne',
    permission: 'rw',
  },
  lastName: {
    value: 'Grant',
    permission: 'rw',
  },
  email: {
    value: 'alberto@carer.com',
    permission: 'rw',
  },
  dateOfBirth: {
    value: '1963-12-24',
    permission: 'rw',
  },
  familyConsent: {
    value: 'Given',
    permission: 'r',
  },
  phones: {
    value: [
      {
        type: 'Mobile',
        phoneNumber: '+11234567821',
        isValid: true,
        isPrimary: true,
        ocSms: 'Given',
      },
      {
        type: 'Home',
        phoneNumber: '+11111115555',
        isValid: true,
        isPrimary: false,
        ocSms: null,
      },
    ],
    permission: 'rw',
  },
  relatedCarers: {
    value: '',
    permission: 'rw',
  },
};

export const personalData = {
  _metadata: {
    readOnlyForm: false,
  },
  firstName: {
    value: 'Mao',
    permission: 'rw',
  },
  lastName: {
    value: 'Moua',
    permission: 'rw',
  },
  email: {
    value: null,
    permission: 'rw',
  },
  dateOfBirth: {
    value: '1951-10-07',
    permission: 'rw',
  },
  familyConsent: {
    value: null,
    permission: 'r',
  },
  phones: {
    value: [
      {
        type: 'Mobile',
        phoneNumber: '+17062431677',
        isValid: true,
        isPrimary: true,
        ocSms: 'Given',
      },
    ],
    permission: 'rw',
  },
  relatedCarers: {
    value: '',
    permission: 'not applicable',
  },
};

export const formViewConfig = {
  ...US_personal,
};

export const formViewConfig_AU = {
  ...AU_personal,
};

export const formViewConfig_readOnly = {
  ...US_personal,
  mode: 'readOnly',
};

export const formViewConfig_readOnly_AU = {
  ...AU_personal,
  mode: 'readOnly',
};

export const addressAndContactConfig = US_addressAndContactConfig;

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import Container from './Container';
import {
  addressConfig_US,
  addressConfig_US_readOnly,
  addressData_US,
} from './AddressView/_mock';

import {
  addressAndContactConfig,
  formViewConfig,
  personalData,
  formViewConfig_readOnly,
} from './FormView/_mock';
import {
  phoneNumbersViewConfig,
  phoneNumbersViewConfig_readOnly,
  carersViewConfig_readOnly,
  phoneNumbers,
  carers,
} from './ListView/_mock';

import { labels, tabsData, singleTabsData } from './_mock';
import { errorModeConfig } from '../Shared/ErrorMode/_mock';

export default {
  title: 'Adaptive Form/AaptiveForm/About Me',
  component: Container,
  decorators: [StoryRouter()],
};

const Template = args => <Container {...args} />;

export const configA = Template.bind({});
configA.args = {
  labels,

  config: {
    handleQueryParams: () => {},
    isLoading: false,
    errorFormView: '',
    isError: false,
    errorMode: '',
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJiY2Y2YzVhNi1iYjJhLTQyZjgtOThhNi1hNDE0MTcwOGQ0ZWYiLCJnaXZlbl9uYW1lIjoiTWFvIiwiZmFtaWx5X25hbWUiOiJNb3VhIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2Mzg3NDkxODYsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJhMDJkMmQ2NmJjOGU4MTcyNTU3MTU3NTZjYTBmYTRkZGEwMGM2MjQwNmY5MGUxZDU1Y2RjZDExMTQxNjYzNTJkSjBwZXdTQ0o3QTFmQUJjUXhxcG04M0U5c3ZUV1ZxbWZpa28wbG5nTTZtUmc2dFElMkZxaCUyRkcxSWRNaHJUbmdaSUdSZ3ByNlBZdlU1ZjVvV1VYc2c1Sm9nTEtqR0dXMzhPODBqN3h4OVZPRWQ5alBWZFZ2TTZ4NEVrdVptR045a2FiQnBrOVM3NmhjZFp2UXFFczB0MktuTVhiQmRNdGdxJTJCMHd0byUyRmMlMkJLMnhJcyUzRGQ5OWMzNjRmYmFmMTg3N2MzYzRlNTk0YjIwM2I1MDFiOTU2Y2JiNDVkODViN2E0ZGRiZjg5NTg5OGYzZjYxYTUiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vYXBwIjoidWgsZG0sZHMsc3RvcmUiLCJpYXQiOjE2Mzg3NDkyMDksImV4cCI6MTYzOTk1ODgwOSwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiMzYyOWFjZGJhOWNmOGVkMmFlYjY5Y2UzNjFlNWZlODA2NTRkOTk3YjUxM2Q3YWFlNjkzNzQ3NmEzM2M1MmRhZVM0YlpnUXdlbWxpVXNtdjhPWVklMkZiQSUzRCUzRDc5ZGYyNGM2MzEzZDcyZDBhMWI0Y2UwY2U5MGUzMDY2ZWIzNWFhZjU5ZDIzYWFhOThiODhiYmE3MTg0NTc0OGUiLCJqdGkiOiI5MTk0Y2UyMC00NTg2LTRlODAtYjIyOS02NWVlYzhhMGM5ZTkifQ.KKKFH0AczfNnminMxQICB8p39X3fcphEa_7vZyU5EScxfMseDb716HmR2I5pltmOZfoa7fl7mzF0ftVbX88HUXepnV2wRvDONDFVeJ4yQdeEAfynLn9LBTeQ2QZaN4Cg5WjG3yDZ_jWMe47iL8qdchfeiWpMooamLC77HAVA7v3NgxrdtAct3rVp1zLyKaZhsRFC9bh5F_5Mi685JHEz780mly9qfsQ0owUhgYtrHt43NLrxudc6hP52wlBogDVrrxEsjL9Z2zPTvBNGeaJkrcwQpp577nlxbWdbKzUXxAZ9V_bAX4i_z0CSxGxWWmKZ4my_bgIUghJMVQcF9QzP5Q',
    popOverPrompt: {
      showPopOverPrompt: false,
      popOverPromptText: '',
      storage: {
        check: 'exists',
        method: 'session',
        name: 'carerPrompt',
        value: 1,
      },
    },
    errorView: errorModeConfig,
    personalView: formViewConfig,
    combinedView: addressAndContactConfig,
  },

  data: {
    personal: personalData,
    address: addressData_US,
    phones: phoneNumbers,
    carers: {
      phones: {
        value: false,
      },
    },
    errorModes: errorModeConfig,
  },
};
configA.storyName = 'Config A: carer viewing complex recipient ';

export const configB = Template.bind({});
configB.args = {
  labels,

  config: {
    handleQueryParams: () => {},
    errorView: errorModeConfig,
    addressView: addressConfig_US,
    contactView: phoneNumbersViewConfig,
    personalView: formViewConfig,
    tabsData,
  },

  data: {
    address: addressData_US,
    personal: personalData,
    phones: phoneNumbers,
  },
};
configB.storyName = 'Config B: carer viewing simple recipient ';

export const configC = Template.bind({});
configC.args = {
  labels,

  config: {
    handleQueryParams: () => {},
    errorView: errorModeConfig,
    addressView: addressConfig_US,
    contactView: phoneNumbersViewConfig,
    carersView: carersViewConfig_readOnly,
    personalView: formViewConfig,
    tabsData: singleTabsData,
  },
  data: {
    address: addressData_US,
    personal: personalData,
    phones: phoneNumbers,
    carers,
  },
};
configC.storyName = 'Config C: Recipient with carer is able to edit';

export const configD = Template.bind({});
configD.args = {
  labels,

  config: {
    handleQueryParams: () => {},
    errorView: errorModeConfig,
    addressView: addressConfig_US_readOnly,
    contactView: phoneNumbersViewConfig_readOnly,
    carersView: carersViewConfig_readOnly,
    personalView: formViewConfig_readOnly,
    tabsData: singleTabsData,
  },

  data: {
    address: addressData_US,
    personal: personalData,
    phones: phoneNumbers,
    carers,
  },
};
configD.storyName =
  'Config D: Recipient with carer is not able to edit';

export const configE = Template.bind({});
configE.args = {
  labels,

  // config: {
  //   handleQueryParams: () => {},
  //   errorView: errorModeConfig,
  //   addressView: addressConfig_US,
  //   contactView: phoneNumbersViewConfig,
  //   personalView: formViewConfig,
  //   tabsData,
  //   titleData: 'firstName',
  // },

  config: {
    handleQueryParams: () => {},
    isLoading: false,
    errorFormView: '',
    isError: false,
    errorMode: '',
    tabsData,
    personalView: {
      country: 'US',
      language: 'en',
      mask: 'mmmm dd yyyy',
      id: 'personalView',
      title: 'labels.af.title.personal2',
      type: 'Form',
      mode: 'readWrite',
      read: {
        name: 'read',
        clkErrorLabel: 'labels.af.personal.read.error.clk',
        errorLabel: 'labels.af.personal.read.error.label',
        elements: [
          {
            id: 'name',
            label: 'labels.af.personal.read.name',
            value: '{{firstName}} {{lastName}}',
            validators: [
              {
                apifield: 'firstName',
                type: 'predefined',
                key: 'required',
                mask: '',
                message:
                  'labels.af.personal.edit.firstname.validation.required',
              },
              {
                apifield: 'lastName',
                type: 'predefined',
                key: 'required',
                mask: '',
                message:
                  'labels.af.personal.edit.lastname.validation.required',
              },
            ],
          },
          {
            id: 'dob',
            label: 'labels.af.personal.read.dob',
            value: '{{dateOfBirth}}',
            validators: [
              {
                apifield: 'dateOfBirth',
                type: 'predefined',
                key: 'required',
                mask: '',
                message: 'labels.af.fields.date.validation.invalid',
              },
            ],
          },
        ],
        fields: [],
      },
      edit: {
        saveLabel: 'labels.af.buttons.buttonBar.save',
        cancelLabel: 'labels.af.buttons.buttonBar.cancel',
        savingLabel: 'labels.af.buttons.buttonBar.saving',
        savedLabel: 'labels.af.buttons.buttonBar.saved',
        edit: 'labels.af.actionBar.buttons.edit',
        cancel: 'labels.af.actionBar.buttons.cancel',
        title: 'labels.af.title.personal2',
        submissionUrl: '/patients/me',
        submissionModel: 'personal',
        mask: 'mmmm dd yyyy',
        elements: [
          {
            id: 'firstname',
            label: 'labels.af.personal.edit.firstname.label',
            apifield: 'firstName',
            type: 'textfield',
            placeholder:
              'labels.af.personal.edit.firstname.placeholder',
            format: '',
            hidden: true,
            validators: [
              {
                apifield: 'firstName',
                type: 'predefined',
                key: 'required',
                mask: '',
                message:
                  'labels.af.personal.edit.firstname.validation.required',
              },
            ],
          },
          {
            id: 'lastname',
            label: 'labels.af.personal.edit.lastname.label',
            apifield: 'lastName',
            type: 'textfield',
            placeholder:
              'labels.af.personal.edit.lastname.placeholder',
            format: '',
            hidden: false,
            validators: [
              {
                apifield: 'lastName',
                type: 'predefined',
                key: 'required',
                mask: '',
                message:
                  'labels.af.personal.edit.lastname.validation.required',
              },
              {
                apifield: 'lastName',
                type: 'mask',
                key: '',
                mask: '/^[^0-9]+$/',
                message:
                  'labels.af.personal.edit.lastname.validation.mask',
              },
            ],
          },
          {
            id: 'date of birth',
            label: 'labels.af.personal.edit.dob.label',
            apifield: 'dateOfBirth',
            type: 'datetime',
            hint: 'labels.af.personal.edit.dob.hint',
            format: '',
            dateFormat: 'mdy',
            hidden: false,
            validators: [
              {
                apifield: 'dateOfBirth',
                type: 'predefined',
                key: 'required',
                mask: '',
                message: 'labels.af.fields.date.validation.invalid',
              },
              {
                apifield: 'dateOfBirth',
                type: 'predefined',
                key: 'dateIsPast',
                mask: '',
              },
            ],
          },
        ],
      },
    },
    addressView: {
      country: 'US',
      language: 'en',
      mask: 'mmmm dd yyyy',
      id: 'addressView',
      title: 'labels.af.title.address',
      type: 'Address',
      mode: 'readWrite',
      read: {},
      edit: {
        saveLabel: 'labels.af.buttons.buttonBar.save',
        cancelLabel: 'labels.af.buttons.buttonBar.cancel',
        savingLabel: 'labels.af.buttons.buttonBar.saving',
        savedLabel: 'labels.af.buttons.buttonBar.saved',
        edit: 'labels.af.actionBar.buttons.edit',
        cancel: 'labels.af.actionBar.buttons.cancel',
        title: 'labels.af.title.address',
        submissionUrl: '/patients/me/address',
        submissionModel: 'address',
        mask: 'mmmm dd yyyy',
      },
      submissionUrl: '/patients/me/address',
      submissionModel: 'address',
    },
    contactView: {
      country: 'US',
      language: 'en',
      mask: 'mmmm dd yyyy',
      id: 'contactView',
      title: 'labels.af.title.contact',
      type: 'List',
      mode: 'readWrite',
      read: {
        name: 'read',
        clkErrorLabel: 'labels.af.personal.read.error.contact.clk',
        errorLabel: 'labels.af.personal.read.error.contact.label',
        elements: [
          {
            id: 'Mobile',
            label: 'labels.af.contact.title.mobile',
            value:
              '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
            validators: [
              {
                apifield: 'phoneNumber',
                type: 'predefined',
                key: 'phoneNumber',
                mask: '',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.required',
              },
              {
                apifield: 'phoneNumber',
                type: 'mask',
                key: '',
                mask: '/^[+ 0-9]+$/',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.mask',
              },
            ],
          },
          {
            id: 'Fax',
            label: 'labels.af.contact.title.fax',
            value:
              '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n</div>',
            validators: [
              {
                apifield: 'phoneNumber',
                type: 'predefined',
                key: 'phoneNumber',
                mask: '',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.required',
              },
              {
                apifield: 'phoneNumber',
                type: 'mask',
                key: '',
                mask: '/^[+ 0-9]+$/',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.mask',
              },
            ],
          },
          {
            id: 'Home',
            label: 'labels.af.contact.title.home',
            value:
              '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>\n',
            validators: [
              {
                apifield: 'phoneNumber',
                type: 'predefined',
                key: 'phoneNumber',
                mask: '',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.required',
              },
              {
                apifield: 'phoneNumber',
                type: 'mask',
                key: '',
                mask: '/^[+ 0-9]+$/',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.mask',
              },
            ],
          },
          {
            id: 'default-fallback',
            label: 'labels.af.contact.title.phone',
            value:
              '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>',
            validators: [
              {
                apifield: 'phoneNumber',
                type: 'predefined',
                key: 'phoneNumber',
                mask: '',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.required',
              },
              {
                apifield: 'phoneNumber',
                type: 'mask',
                key: '',
                mask: '/^[+ 0-9]+$/',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.mask',
              },
            ],
          },
          {
            id: 'Work',
            label: 'labels.af.contact.title.work',
            value:
              '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
            validators: [
              {
                apifield: 'phoneNumber',
                type: 'predefined',
                key: 'phoneNumber',
                mask: '',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.required',
              },
              {
                apifield: 'phoneNumber',
                type: 'mask',
                key: '',
                mask: '/^[+ 0-9]+$/',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.mask',
              },
            ],
          },
        ],
        fields: [
          {
            name: 'isPreferred',
            text: 'labels.af.contact.isPreferred',
          },
          {
            name: 'isSmsEnabled',
            text: 'labels.af.contact.isSmsEnabled',
          },
        ],
      },
      edit: {
        saveLabel: 'labels.af.buttons.buttonBar.save',
        cancelLabel: 'labels.af.buttons.buttonBar.cancel',
        savingLabel: 'labels.af.buttons.buttonBar.saving',
        savedLabel: 'labels.af.buttons.buttonBar.saved',
        edit: 'labels.af.actionBar.buttons.edit',
        cancel: 'labels.af.actionBar.buttons.cancel',
        title: 'labels.af.title.contact',
        submissionUrl: '/patients/me',
        submissionModel: 'contact',
        mask: 'mmmm dd yyyy',
        elements: [
          {
            id: 'phoneNumber',
            label: 'labels.af.contact.edit.phoneNumber.input',
            apifield: 'phoneNumber',
            type: 'phonenumber',
            placeholder:
              'labels.af.contact.edit.phoneNumber.placeholder',
            format: '',
            hidden: false,
            phoneNumberLength: 0,
            useStrictMode: true,
            validators: [
              {
                type: 'predefined',
                key: 'phoneNumber',
                mask: '',
                message:
                  'labels.af.contact.edit.phoneNumber.validation.required',
              },
            ],
          },
        ],
        phoneTypes: [
          {
            value: 'Fax',
            label: 'Fax',
          },
          {
            value: 'Home',
            label: 'Home',
          },
          {
            value: 'Mobile',
            label: 'Mobile',
          },
          {
            value: 'Work',
            label: 'Work',
          },
        ],
        smsInformation:
          'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel',
        phoneLabel: 'labels.af.contact.edit.phoneNumber.phoneLabel',
        phonePromptText:
          'labels.af.contact.edit.phoneNumber.phonePromptText',
        countryLabel:
          'labels.af.contact.edit.phoneNumber.countryLabel',
        countryPromptText:
          'labels.af.contact.edit.phoneNumber.countryPromptText',
        nationalNumberLabel:
          'labels.af.contact.edit.phoneNumber.nationalNumberLabel',
        preferredLabel:
          'labels.af.contact.edit.phoneNumber.preferredLabel',
        ocSmsLabel: 'labels.af.contact.edit.phoneNumber.ocSmsLabel',
        noOptionsMessage:
          'labels.af.contact.edit.phoneNumber.noOptionsMessage',
        showOcSms: true,
        showPreferred: true,
        phoneNumberLength: '0',
        useStrictMode: true,
      },
    },
    errorView: errorModeConfig,
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiJiY2Y2YzVhNi1iYjJhLTQyZjgtOThhNi1hNDE0MTcwOGQ0ZWYiLCJnaXZlbl9uYW1lIjoiTWFvIiwiZmFtaWx5X25hbWUiOiJNb3VhIiwibG9jYWxlIjoiZW5fVVMiLCJhdXRoX3RpbWUiOjE2Mzg3NDkxODYsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9jb3VudHJ5X2NvZGUiOiJVUyIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJSZWNpcGllbnQiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJhMDJkMmQ2NmJjOGU4MTcyNTU3MTU3NTZjYTBmYTRkZGEwMGM2MjQwNmY5MGUxZDU1Y2RjZDExMTQxNjYzNTJkSjBwZXdTQ0o3QTFmQUJjUXhxcG04M0U5c3ZUV1ZxbWZpa28wbG5nTTZtUmc2dFElMkZxaCUyRkcxSWRNaHJUbmdaSUdSZ3ByNlBZdlU1ZjVvV1VYc2c1Sm9nTEtqR0dXMzhPODBqN3h4OVZPRWQ5alBWZFZ2TTZ4NEVrdVptR045a2FiQnBrOVM3NmhjZFp2UXFFczB0MktuTVhiQmRNdGdxJTJCMHd0byUyRmMlMkJLMnhJcyUzRGQ5OWMzNjRmYmFmMTg3N2MzYzRlNTk0YjIwM2I1MDFiOTU2Y2JiNDVkODViN2E0ZGRiZjg5NTg5OGYzZjYxYTUiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vYXBwIjoidWgsZG0sZHMsc3RvcmUiLCJpYXQiOjE2Mzg3NDkyMDksImV4cCI6MTYzOTk1ODgwOSwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiMzYyOWFjZGJhOWNmOGVkMmFlYjY5Y2UzNjFlNWZlODA2NTRkOTk3YjUxM2Q3YWFlNjkzNzQ3NmEzM2M1MmRhZVM0YlpnUXdlbWxpVXNtdjhPWVklMkZiQSUzRCUzRDc5ZGYyNGM2MzEzZDcyZDBhMWI0Y2UwY2U5MGUzMDY2ZWIzNWFhZjU5ZDIzYWFhOThiODhiYmE3MTg0NTc0OGUiLCJqdGkiOiI5MTk0Y2UyMC00NTg2LTRlODAtYjIyOS02NWVlYzhhMGM5ZTkifQ.KKKFH0AczfNnminMxQICB8p39X3fcphEa_7vZyU5EScxfMseDb716HmR2I5pltmOZfoa7fl7mzF0ftVbX88HUXepnV2wRvDONDFVeJ4yQdeEAfynLn9LBTeQ2QZaN4Cg5WjG3yDZ_jWMe47iL8qdchfeiWpMooamLC77HAVA7v3NgxrdtAct3rVp1zLyKaZhsRFC9bh5F_5Mi685JHEz780mly9qfsQ0owUhgYtrHt43NLrxudc6hP52wlBogDVrrxEsjL9Z2zPTvBNGeaJkrcwQpp577nlxbWdbKzUXxAZ9V_bAX4i_z0CSxGxWWmKZ4my_bgIUghJMVQcF9QzP5Q',
    popOverPrompt: {
      showPopOverPrompt: false,
      popOverPromptText: '',
      storage: {
        check: 'exists',
        method: 'session',
        name: 'carerPrompt',
        value: 1,
      },
    },
  },
  data: {
    personal: personalData,
    address: addressData_US,
    phones: phoneNumbers,
    carers: {
      phones: {
        value: false,
      },
    },
    errorModes: errorModeConfig,
  },
};
configE.storyName =
  'Config E: Recipient without carer is able to edit';

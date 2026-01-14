// import { Data } from '@react-google-maps/api';

import { getPhoneTypes } from '../../Shared/PhoneNumberField/_mock';
import { US_carer, US_contact } from '../_mock';

export const errorPhoneNumbers = {
  phones: {
    value: [
      {
        id: 'Mobile',
        phoneNumber: null,
        isValid: true,
        isPrimary: true,
        ocSms: 'Given',
      },
      {
        id: 'Home',
        phoneNumber: '+15217543666',
        isValid: true,
        isPrimary: false,
        ocSms: null,
      },
    ],
  },
};

export const carers = {
  phones: {
    value: [
      {
        type: 'default',
        displayValue: 'mounir Zarkan',
      },
      {
        type: 'default',
        displayValue: 'Pete Aad',
      },
    ],
  },
};

export const phoneNumbers = {
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

export const phoneNumbersViewConfig = {
  ...US_contact,
};

export const phoneNumbersViewConfig_readOnly = {
  ...US_contact,
  mode: 'readOnly',
};

export const carersViewConfig_readOnly = {
  ...US_carer,
};

//TODO : what is different here
export const phoneNumbersViewNoOcSmsConfig = {
  ...US_contact,
};

//TODO : what is different here
export const phoneNumbersViewNoOcSmsConfig_readOnly = {
  ...US_contact,
  mode: 'readOnly',
};

export const phoneNumbersViewConfigErrors = {
  country: 'US',
  language: 'en',
  mask: 'mmmm dd yyyy',
  id: 'contactView',
  title: 'labels.af.title.contact',
  type: 'List',
  mode: 'readOnly',
  read: {
    name: 'read',
    clkErrorLabel: 'labels.af.personal.read.error.contact.clk',
    errorLabel: 'labels.af.personal.read.error.contact.label',
    elements: [
      {
        id: 'Mobile',
        label: 'labels.af.contact.title.mobile',
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
  },
  isEdit: '',
  token:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI2Y2U3ZjY3MC02NTc3LTQ4MTktYWUzZS1mNzk2MGM5OGEyNjMiLCJnaXZlbl9uYW1lIjoiTWtlbm5hIiwiZmFtaWx5X25hbWUiOiJNb3JnYW4iLCJsb2NhbGUiOiJlbl9VUyIsImF1dGhfdGltZSI6MTYzOTA5ODMwOSwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NvdW50cnlfY29kZSI6IlVTIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL3VzZXJfdHlwZSI6IlJlY2lwaWVudCIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9zZl90b2tlbiI6ImQwZTI3MGE1YTAxMjE4MDI4ZjliMzhhMGFkZGRlNTRlYjE4NDQ0MTY1OThkOTkzYzNjYTEyNTYxNjU1OTZkZDV0M1YyaHZVUjN0a1dGZVJUOVYwZVVGd3hkV3glMkJYb2w0OEVhVTZUdiUyRnVSb1BUZ3ZBQ1JqJTJGczF1QzEwRE1CY2pub1l0QmZyN3NkMEZuaURnaFpHTSUyQiUyQmp1RG9ReXhwWlR0clVYSnI1VDhVa3BJUlB4aHF4RmxOMDAxSXgzODIzYXgxWHAzTVVpb3lZcGhGTzJGMElZMmRjdVdWUHNkWWpoN0R2UFQlMkZueTU5ZWMlM0RiODUzZjJjNjc1Y2U3MTA0YTYzYzU3ZDFlYzZjYjIzOTljNGU3MDk2YzNiOGExZmEwYmRhZThlYTBjNzk4NzAwIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6InVoLGRtIiwiaWF0IjoxNjM5MDk4MzEzLCJleHAiOjE2NDAzMDc5MTMsImlzcyI6Imh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbSIsInN1YiI6IjZkNzgyZWNlYWNmN2Y5ZWFjN2VlNjBiMzQ5MjlhYzczYWNmOWQ4YTkyZjg0MTE2OGMyNGE4ZjQ0NDNiYTk1ODJOQXRHVGQ1OW5vdXdCYlBRUSUyRmF2c2clM0QlM0QyZDFlMWFlOTA5NzZjMDM4OWZhMTUzOWIxOTRkNWM0ZGI0MWJjNjIyYjJiYjYzMGRlMjU3M2RhYzg4ZTk4MDliIiwianRpIjoiYjA1NjVmZjctMzE4Ny00N2ZkLTg1N2MtMDRmMDU1ZTQ5MDI4In0.i17UdywjgCxyvwj3UbPviFY4OOiSHtklLedAZy3ZP5mHhCE9vdEqdVAsqtnu2cDxf_Ys66tM0mPzBZgngUb0LeoaMgeuAv7O9KFEVa_cuFwA8fr2xHxzMOXf6EmHcQi2BwM8euwaAy77plOumE_F6CQ3-6mWzspmhAGn8nMIswmPpPWei_2DjAxM8dyFvaPjtIxv0suJlItU1UBJeeGmVecgSCSgxlhdfbxd1E7saOJmzPQ2tJynt3iRnYT82F5ElqmXwEIFrj0m-hH5ki4PKhp30aI9rNrD4mjAaJfSyfmfEqxgIE_cy-n_ZwwaX2Tr-PW2FDyT-fL4IFlYctz2JA',
  tabsData: {
    accountId: '6ce7f670-6577-4819-ae3e-f7960c98a263',
    userId: 0,
    labels: {
      promptText: 'Select a recipient...',
      promptTextAbbrv: 'recipient...',
      type: 'recipient',
    },
    tabs: [
      {
        firstName: 'Mkenna',
        lastName: 'Morgan',
        tabIndex: 0,
        type: 'Recipient',
        userId:
          '6d782eceacf7f9eac7ee60b34929ac73acf9d8a92f841168c24a8f4443ba9582NAtGTd59nouwBbPQQ%2Favsg%3D%3D2d1e1ae90976c0389fa1539b194d5c4db41bc622b2bb630de2573dac88e9809b',
      },
    ],
  },
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
  errorView: {
    codeLabel: 'Error code',
    errorResponse: '',
    mode: '',
    data: {
      submit: {
        image: {
          src: 'https://assets.cochlear.com/api/public/content/9bfd65ed69994fa49be3ff1339ea9674?v=7fff6f01',
          alt: 'Bug.svg',
          width: '120',
        },
        title: "That's strange, it seems something went wrong.",
        text: 'We had a problem updating your details.<br />If you need immediate help, contact our customer support team on <a href="tel:+1-877-651-7001" class="ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">877-651-7001.</a>',
        buttons: [
          {
            name: 'tryAgain',
            variant: 'brand-primary',
            text: 'Try again',
            icon: '',
            link: '',
            action: 'retry-submit',
            useCallback: true,
          },
          {
            name: 'backToHome',
            variant: 'secondary',
            text: 'Cochlear home',
            icon: 'chevron-right',
            link: 'https://node.sit.cms.cochlear.cloud/us/en/home',
            action: 'link-cochlear-home',
            useCallback: false,
          },
        ],
      },
      read: {
        image: {
          src: 'https://assets.cochlear.com/api/public/content/9bfd65ed69994fa49be3ff1339ea9674?v=7fff6f01',
          alt: 'Bug.svg',
          width: '120',
        },
        title: "That's strange, it seems something went wrong.",
        text: 'We’re working to fix the problem and we’ll be up and running soon.<br />If you need immediate help, contact our customer support team on <a href="tel:+1-877-651-7001" class="ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">877-651-7001.</a>',
        buttons: [
          {
            name: 'backToHome',
            variant: 'secondary',
            text: 'Cochlear home',
            icon: 'chevron-right',
            link: '/us/en/home',
            action: 'link-cochlear-home',
            useCallback: false,
          },
        ],
      },
    },
  },
  errorFormView: '',
};

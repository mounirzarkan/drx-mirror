/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import ListView from './ListView';
import {
  phoneNumbersViewConfig,
  phoneNumbers,
  errorPhoneNumbers,
} from './_mock';
import { labels } from '../_mock';

export default {
  title: 'Adaptive Form/List View/Container',
  component: ListView,
  decorators: [StoryRouter()],
};

const Template = args => <ListView {...args} />;

export const container_default = Template.bind({});
container_default.args = {
  labels,
  // config: phoneNumbersViewConfig,
  config: {
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
            '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">\n{{phoneNumber}}\n</div>\n{{#ocSms}}\n<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>\n{{fields.isSmsEnabled.text}}\n</div>\n{{/ocSms}}\n\n{{#isPrimary}}\n\n<div class="ccl__list-read-mode__element__field">\n{{fields.isPreferred.text}}\n</div>\n\n{{/isPrimary}}\n\n</div>',
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
      countryLabel: 'labels.af.contact.edit.phoneNumber.countryLabel',
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
    isEdit: '',
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI0MTgwOWY0Zi00MzdmLTQzZWMtYmZkNS0xYzE2NWQwNDc0ZGQiLCJnaXZlbl9uYW1lIjoiRWR3YXJkIiwiZmFtaWx5X25hbWUiOiJHcmFudCIsImxvY2FsZSI6ImVuX1VTIiwiYXV0aF90aW1lIjoxNjM4NzUzMDI5LCJodHRwczovL3d3dy5jb2NobGVhci5jb20vY291bnRyeV9jb2RlIjoiVVMiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiJkMDAxMWJlMzk5ZjI0MzYzOWUxMTMyNDhhZDkyZGRlODNjZGE3ZWI3YWIxNzllMjliNDZhYjZjZjZmODc2Nzgwd0xqWDlOOG9IQk1MSnVqUnpib1VQTUVrOG9hZDZBaWRDUHBINlY0WklTQmZkWVRpd01MUW9OJTJGNmhPczFvMzIlMkZBcHVkeSUyQlI0ZjJwR3dMWGRwbGdoOGlCSFpZVWNMeVh2aEFndG9IJTJCUmc1RUhScHNtcG9GVmVNd25vVERYbVJZbTZNSUJrWDByenczQmFoY0FuajVDbXVYQlF0N2E3VkFMUTZvS2gwbWZKYTQlM0QzNmIyMzViMzkzMDVmYTg5YjQyMWEwZWNjYWVmYzE1YjA0MGUxYTMxMGFmM2VjOTI1ODYzZGQwY2NiYTFlY2E2IiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL3VzZXJfdHlwZSI6IkNhcmVyIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6InVoLGRtLHN0b3JlIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL3JlY2lwaWVudCI6Ilt7XCJmaXJzdE5hbWVcIjpcIkFkcmllbm5lXCIsXCJsYXN0TmFtZVwiOlwiR3JhbnRcIixcIkNvY2hsZWFySWRcIjpcIjk4M2ZlMTAyNjU2NGU2YzAzYzRkNjc3YmE2NDk5Nzk4NDM5OTJiYTI1N2Q4MGIxYmM2ZTY5NWFhZDEzZGMxZWVkNWpKc1RYN3VkWjhQYXJEY2xNSkxBJTNEJTNEYzlmNzk1YjNjODRiMjM3YTRlYWRkNjY1YjE5YjUzYzEzZDM5M2NiN2NjNTVhNDQwZTNjZDY5MzE1NjkwMDU1M1wifV0iLCJpYXQiOjE2Mzg3NTMwMzAsImV4cCI6MTYzODc2MDIzMCwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiOWM2Mjc4N2JiMWQ3ZDMzZDU2ODcxYjNmOTE0NzBhODEzNGZiMDcxODcwOTM3ODNhM2Y1YzYwMThjNjIzMjVlZHZhSDM5NElXQlpiSVJFbU9XTkx2anclM0QlM0RiZGIyMTlhYzcyMmQxY2ZiODI2Mjc1NTk3NzdiNGY2Njc4M2QwMmM5MjE2NzUxMWNiMmFiMGMzNzRlOTZmMWMzIiwianRpIjoiZjkwNWNjY2QtMTJiMS00YTEwLTkwZTItZmU4Mjk2MDdkNjliIn0.C6jKNqqqRp1j7D8EOJSM-2RRHN4zTqWmTpxuT3ePMJQYXamUl_ig2i4_6ii83i42wKCZ0OSN95lAPLONDeIai0Sggg1vLMCzZ4-wJ3iQ2138y48MowrY-PWfovsij0nGzOOw1XHG2duiVqXW57rKgfsZLr_WlttOPL9lNclg-3ib4I050Gmkuun-p7_xRl5utyiS7K07MnfsnIEeu8GiIr8qPFXwljCnXKIkKflfe2O1BQCWtAbetnelAeQZkKbybzKL3SoZB8s8aF2WeWclzI4YpEvDja7-Se1BwdW4ELckuI8FIuQe3H_Z6lK-RedUJowLs8Q6BYRWtKmO200W3g',
    tabsData: {
      accountId: '41809f4f-437f-43ec-bfd5-1c165d0474dd',
      userId: 1,
      labels: {
        promptText: 'Select a recipient...',
        promptTextAbbrv: 'recipient...',
        type: 'recipient',
      },
      tabs: [
        {
          firstName: 'Edward',
          lastName: 'Grant',
          tabIndex: 0,
          type: 'Carer',
          userId:
            '9c62787bb1d7d33d56871b3f91470a8134fb07187093783a3f5c6018c62325edvaH394IWBZbIREmOWNLvjw%3D%3Dbdb219ac722d1cfb82627559777b4f66783d02c92167511cb2ab0c374e96f1c3',
        },
        {
          firstName: 'Adrienne',
          lastName: 'Grant',
          tabIndex: 1,
          type: 'Recipient',
          userId:
            '983fe1026564e6c03c4d677ba649979843992ba257d80b1bc6e695aad13dc1eed5jJsTX7udZ8ParDclMJLA%3D%3Dc9f795b3c84b237a4eadd665b19b53c13d393cb7cc55a440e3cd693156900553',
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
            src:
              'https://mss-p-007-delivery.stylelabs.cloud/api/public/content/9bfd65ed69994fa49be3ff1339ea9674?v=7fff6f01',
            alt: 'Bug.svg',
            width: '120',
          },
          title: "That's strange, it seems something went wrong.",
          text:
            'We had a problem updating your details.<br />If you need immediate help, contact our customer support team on <a href="tel:+1-877-651-7001" class="ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">877-651-7001.</a>',
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
            src:
              'https://mss-p-007-delivery.stylelabs.cloud/api/public/content/9bfd65ed69994fa49be3ff1339ea9674?v=7fff6f01',
            alt: 'Bug.svg',
            width: '120',
          },
          title: "That's strange, it seems something went wrong.",
          text:
            'We’re working to fix the problem and we’ll be up and running soon.<br />If you need immediate help, contact our customer support team on <a href="tel:+1-877-651-7001" class="ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">877-651-7001.</a>',
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
  },
  data: phoneNumbers,
};

container_default.storyName = 'default';

export const container_error = Template.bind({});
container_error.args = {
  labels,
  config: {
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
            '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">\n{{phoneNumber}}\n</div>\n{{#ocSms}}\n<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>\n{{fields.isSmsEnabled.text}}\n</div>\n{{/ocSms}}\n\n{{#isPrimary}}\n\n<div class="ccl__list-read-mode__element__field">\n{{fields.isPreferred.text}}\n</div>\n\n{{/isPrimary}}\n\n</div>',
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
      countryLabel: 'labels.af.contact.edit.phoneNumber.countryLabel',
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
    isEdit: '',
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI0OWMzYzYzOC1lOTNhLTQ2OTUtOTE1ZS00Y2FhMTk5YzcwODciLCJnaXZlbl9uYW1lIjoiRWxseSIsImZhbWlseV9uYW1lIjoiRXJpY2tzb24iLCJsb2NhbGUiOiJlbl9VUyIsImF1dGhfdGltZSI6MTYzOTQ1NzMyMCwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2NvdW50cnlfY29kZSI6IlVTIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL3NmX3Rva2VuIjoiMzdiZjZjYTk0NWExZjU2NDZjZjBhOWEzYzZlNTJhNGEzOGE2YmZmMWJjNjAxYmZkOGYwNzU0ZWE1NTc3NjVjOFNoMm4xRW1BcFkxZ1JIRGxwWk9XRDVySTBLeFdUbXgzVnlhc2dpNiUyQnFIdkZvNGhQVktWM01IRjZzaVJZelVsWnFMalplJTJCNGx0ek84OVFUJTJGRXRMaGcwOXAlMkZrYWxOUDkzaEphZk9yNkhieW1OQ2hDZyUyRjEzelhkc3k3SEIlMkJlc3FBMjV1QnlUazFQJTJGSFJrbjNVUjlXVnd6aklwN3JzbzVaYXhhczJUTTgzalVVJTNENGU2MjM4ZGNhNmJkMmI5NjRiMzQ0NWFlZWY4NTUyNTY2ZjRlNTNhNDI1OWQxNmJhYTY0YTc5NjUyNDI1MjAxMSIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS91c2VyX3R5cGUiOiJDYXJlciIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9hcHAiOiJ1aCxkbSxzdG9yZSIsImh0dHBzOi8vd3d3LmNvY2hsZWFyLmNvbS9yZWNpcGllbnQiOiJbe1wiZmlyc3ROYW1lXCI6XCJHd2VuXCIsXCJsYXN0TmFtZVwiOlwiTGVhcGhhcnRcIixcIkNvY2hsZWFySWRcIjpcImI0MDNmOTA3YWE5NDNhZjdjYzBlOGM4ZDRhOWZiMDVjYTUyYzFhZDYyYjAzOWQwYjQxYjY1ZDA3Y2UyN2FmMTVsS2pPR2VMbUVDeU0lMkJWQ05VeXI0a3clM0QlM0RjMDg3NTc1MDQxYWU0MmM1NjU4MTNlNWUzODc4OWE3ODhkYzc1NzE0Y2QwNTgyMjIzNzAzOWQzZDM4ZjRmNjJlXCJ9LHtcImZpcnN0TmFtZVwiOlwiTWFyaWFuXCIsXCJsYXN0TmFtZVwiOlwiSHVibGVyXCIsXCJDb2NobGVhcklkXCI6XCJjN2ZmYTdjNDk1MGQ0MmUwYmU3MjIzYmIzOGQ5ZDI4NmFjMzczOGVlNDczODRjZTRhODNjNTFlOTZkMzU5MWQ1OGE4REhBeTloJTJCUWRIMzdiV2dkWW1nJTNEJTNEYzZkM2UxNDg4MmNiNWVkMTZkY2QyOTQzYTZhYTllNjhhOWZjZmZjMDBiZGQ5ODFmZjA1ZDQ3NjA4YTdiYTI5M1wifSx7XCJmaXJzdE5hbWVcIjpcIkhlbnJ5XCIsXCJsYXN0TmFtZVwiOlwiWmhhbmdcIixcIkNvY2hsZWFySWRcIjpcImQzZGI0NDZhYmFmOGE5NDA2ZjE0NWI1YWEzODljMmRlNDJmNDNhZWRjNjBjMTEzNGM1NmI5ODkzNDZlOWM3N2JoZW5FR1BRQzFxRlBBQUl1UUZlYWtnJTNEJTNEN2FmNTVjNmQ2YjBmOWQ5MjVjNTYxZjgyNDc5ZmRkMGNkMzc3MzM2MDExMjY3MWE2MjA3OWE5MGY2OGIxNzZlMFwifV0iLCJpYXQiOjE2Mzk0NTczMjAsImV4cCI6MTYzOTQ2NDUyMCwiaXNzIjoiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tIiwic3ViIjoiYWY1YjFkZWQ0MjYwMmMyNDQyNjQ0NDNkY2UxY2QyNzE2ZWExNGE4MTM4NWQ0YmM1MzJiMTQ4Mzk2OTQ4MDZkNHpyVWMxajFKVWpvTXhtQVZ0ZmFNR2clM0QlM0RlYTdjM2M3YzZmNTBlNDZhZTY3NzM2ZTFkYmJlMjY3ZTgzZTkzNDZkYWMwYTlhYzdhN2IyYTZlMDU5MzA4M2ExIiwianRpIjoiMzkwYjkyN2YtMTMxNi00NWZjLThhNGEtNDAyNmQ0MjFmNTdkIn0.GI_VA15avh9zdmfqYwVJ8pcwGloFRKchyF95ArpNMW-FlHwhlzC-yxs1azYtpZCcNY5uFXiqxaGFMTiv57QZ_J5k2PvJz9g0wa7UK-RKj_9A65G2w62PVRlIXrOBEf66fVVcMj1wV6quRwKvGeThrNWJW9psLrZNJBh1mR-xGdLdfavMIa8OQ23wgfuJs6sMfvUuJohjKWRSRzUTOf1WlJsrP-8WiFH6oHA1oBy9Eo7C32XOof-WK9TPRHl-hRW4PJmjZ_JvP_-agcXS65r6QeIX51prnrKeTTew0gxE79wA0JFAl_RvDkZdRVrSU1pCLreHMm10MkH0KTQnl1EJKA',
    tabsData: {
      accountId: '49c3c638-e93a-4695-915e-4caa199c7087',
      userId: 1,
      labels: {
        promptText: 'Select a recipient...',
        promptTextAbbrv: 'recipient...',
        type: 'recipient',
      },
      tabs: [
        {
          firstName: 'Elly',
          lastName: 'Erickson',
          tabIndex: 0,
          type: 'Carer',
          userId:
            'af5b1ded42602c244264443dce1cd2716ea14a81385d4bc532b14839694806d4zrUc1j1JUjoMxmAVtfaMGg%3D%3Dea7c3c7c6f50e46ae67736e1dbbe267e83e9346dac0a9ac7a7b2a6e0593083a1',
        },
        {
          firstName: 'Gwen',
          lastName: 'Leaphart',
          tabIndex: 1,
          type: 'Recipient',
          userId:
            'b403f907aa943af7cc0e8c8d4a9fb05ca52c1ad62b039d0b41b65d07ce27af15lKjOGeLmECyM%2BVCNUyr4kw%3D%3Dc087575041ae42c565813e5e38789a788dc75714cd05822237039d3d38f4f62e',
        },
        {
          firstName: 'Henry',
          lastName: 'Zhang',
          tabIndex: 2,
          type: 'Recipient',
          userId:
            'd3db446abaf8a9406f145b5aa389c2de42f43aedc60c1134c56b989346e9c77bhenEGPQC1qFPAAIuQFeakg%3D%3D7af55c6d6b0f9d925c561f82479fdd0cd3773360112671a62079a90f68b176e0',
        },
        {
          firstName: 'Marian',
          lastName: 'Hubler',
          tabIndex: 3,
          type: 'Recipient',
          userId:
            'c7ffa7c4950d42e0be7223bb38d9d286ac3738ee47384ce4a83c51e96d3591d58a8DHAy9h%2BQdH37bWgdYmg%3D%3Dc6d3e14882cb5ed16dcd2943a6aa9e68a9fcffc00bdd981ff05d47608a7ba293',
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
            src:
              'https://mss-p-007-delivery.stylelabs.cloud/api/public/content/9bfd65ed69994fa49be3ff1339ea9674?v=7fff6f01',
            alt: 'Bug.svg',
            width: '120',
          },
          title: "That's strange, it seems something went wrong.",
          text:
            'We had a problem updating your details.<br />If you need immediate help, contact our customer support team on <a href="tel:+1-877-651-7001" class="ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">877-651-7001.</a>',
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
            src:
              'https://mss-p-007-delivery.stylelabs.cloud/api/public/content/9bfd65ed69994fa49be3ff1339ea9674?v=7fff6f01',
            alt: 'Bug.svg',
            width: '120',
          },
          title: "That's strange, it seems something went wrong.",
          text:
            'We’re working to fix the problem and we’ll be up and running soon.<br />If you need immediate help, contact our customer support team on <a href="tel:+1-877-651-7001" class="ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">877-651-7001.</a>',
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
  },
  data: errorPhoneNumbers,
};

container_error.storyName = 'Error';

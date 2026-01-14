/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReadMode from './ReadMode';
import mapContactConfig from '../../../utils/adaptiveForm/mapContactConfig';
import convertContactReadData from '../../../utils/adaptiveForm/convertContactReadData';
import {
  phoneNumbers,
  phoneNumbersViewConfig_readOnly,
  errorPhoneNumbers,
} from './_mock';
import { labels } from '../_mock';

export default {
  title: 'Adaptive Form/List View/ReadMode',
  component: ReadMode,
};

const Template = args => <ReadMode {...args} />;

export const FormView_default = Template.bind({});
FormView_default.args = {
  labels,
  data: convertContactReadData(phoneNumbers),
  // config: phoneNumbersViewConfig_readOnly.read,
  config: {
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
    mask: 'mmmm dd yyyy',
    isRequired: true,
    id: 'contactView',
    country: 'US',
  },
};
FormView_default.storyName = 'default';

export const FormView_error = Template.bind({});
FormView_error.args = {
  labels,
  data: convertContactReadData(errorPhoneNumbers),
  // config: mapContactConfig(labels).read,
  config: {
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
    onErrorHandle: null,
    mask: 'mmmm dd yyyy',
    isRequired: true,
    id: 'contactView',
    country: 'US',
  },
};
FormView_error.storyName = 'error';

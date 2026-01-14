/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PhoneNumberField from './PhoneNumberField';
import { getPhoneTypes } from './_mock';

export default {
  title: 'Shared/Phone number',
  component: PhoneNumberField,
};

const Template = args => <PhoneNumberField {...args} />;

export const preferredAndAllow = Template.bind({});

preferredAndAllow.args = {
  data: {
    type: 'Mobile',
    nationalNumber: '',
    country: 'US',
    isValid: true,
    isPrimary: true,
    ocSms: 'Given',
  },
  config: {
    onChange: null,
    showOcSms: true,
    showPreferred: true,
    phoneTypes: getPhoneTypes(),
    countryLabel: 'Country code',
    countryPromptText: 'Select...',
    nationalNumberLabel: 'Area code and phone number',
    ocSmsLabel: 'Allow SMS alerts',
    phoneLabel: 'Number type',
    phonePromptText: 'Select...',
    preferredLabel: 'Set as primary contact number',
    smsInformation:
      'Allow SMS alerts: Sign-up to receive service-related text messages about your orders, warranty information and more. Message and data rates may apply. Learn more about Cochlear’s Privacy Policy at <a href="https://www.cochlear.com/privacy">www.cochlear.com/privacy</a>',
    noOptionsMessage: 'No matching options',
  },
};
preferredAndAllow.storyName = 'Preferred & Allow SMS';

export const preferredOnly = Template.bind({});

preferredOnly.args = {
  data: {
    type: 'Mobile',
    nationalNumber: '',
    country: 'US',
    isValid: true,
    isPrimary: true,
    ocSms: 'Given',
  },
  config: {
    handleBlur: () => {},
    onChange: null,
    showOcSms: false,
    showPreferred: true,
    phoneTypes: getPhoneTypes(),
    countryLabel: 'Country code',
    countryPromptText: 'Select...',
    nationalNumberLabel: 'Area code and phone number',
    ocSmsLabel: 'Allow SMS alerts',
    phoneLabel: 'Number type',
    phonePromptText: 'Select...',
    preferredLabel: 'Set as primary contact number',
    smsInformation:
      'Allow SMS alerts: Sign-up to receive service-related text messages about your orders, warranty information and more. Message and data rates may apply. Learn more about Cochlear’s Privacy Policy at <a href="https://www.cochlear.com/privacy">www.cochlear.com/privacy</a>',
    noOptionsMessage: 'No matching options',
  },
};
preferredOnly.storyName = 'Preferred';

export const disabledPreferred = Template.bind({});
disabledPreferred.args = {
  data: {
    type: 'Mobile',
    nationalNumber: '',
    country: 'US',
    isValid: true,
    isPrimary: true,
    ocSms: 'Given',
  },
  config: {
    disablePreferred: true,
    handleBlur: () => {},
    onChange: null,
    showOcSms: false,
    showPreferred: true,
    phoneTypes: getPhoneTypes(),
    countryLabel: 'Country code',
    countryPromptText: 'Select...',
    nationalNumberLabel: 'Area code and phone number',
    ocSmsLabel: 'Allow SMS alerts',
    phoneLabel: 'Number type',
    phonePromptText: 'Select...',
    preferredLabel: 'Set as primary contact number',
    smsInformation:
      'Allow SMS alerts: Sign-up to receive service-related text messages about your orders, warranty information and more. Message and data rates may apply. Learn more about Cochlear’s Privacy Policy at <a href="https://www.cochlear.com/privacy">www.cochlear.com/privacy</a>',
    noOptionsMessage: 'No matching options',
  },
};
disabledPreferred.storyName = 'Disabled Preferred';

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReadModeComposite from './ReadModeComposite';

export default {
  title: 'Shared/ReadModeComposite',
  component: ReadModeComposite,
};

const Template = args => <ReadModeComposite {...args} />;

export const personalDetails = Template.bind({});
personalDetails.args = {
  id: 'name',
  value: '{{firstName}} {{lastName}}',
  validators: [],
  onErrorHandle: () => {},
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  title: 'Name',
  data: {
    firstName: {
      value: 'Fred',
    },
    lastName: {
      value: 'Han',
    },
  },
};
personalDetails.storyName = 'Name';

export const personalDetailsNameError = Template.bind({});
personalDetailsNameError.args = {
  missingTag: 'firstName',
  id: 'name',
  value: '{{firstName}} {{lastName}}',
  errorLinkTo: null,
  onErrorHandle: missingTag => {
    alert(`missing: ${missingTag}`);
  },
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  title: 'Name',
  data: {
    firstName: {
      value: '',
    },
    lastName: {
      value: 'Han',
    },
  },
};
personalDetailsNameError.storyName = 'Name Error';

export const personalDetailsDOB = Template.bind({});
personalDetailsDOB.args = {
  id: 'dob',
  title: 'Date of birth',
  value: '{{dateOfBirth}}',
  errorLinkTo: null,
  onErrorHandle: () => {},
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  data: {
    dateOfBirth: {
      value: 'Sep 05, 1950',
    },
  },
};
personalDetailsDOB.storyName = 'DOB';

export const personalDetailsDOBError = Template.bind({});
personalDetailsDOBError.args = {
  missingTag: 'dateOfBirth',
  id: 'dob',
  title: 'Date of birth',
  value: '{{dateOfBirth}}',
  errorLinkTo: null,
  onErrorHandle: missingTag => {
    alert(`missing: ${missingTag}`);
  },
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  data: {
    firstName: {
      value: 'Fred',
    },
    lastName: {
      value: 'Han',
    },
    dateOfBirth: {
      value: null,
    },
  },
};
personalDetailsDOBError.storyName = 'DOB Error';

export const mobile = Template.bind({});
mobile.args = {
  id: 'mobile',
  title: 'Mobile',
  value:
    '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}</div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>{{/isPrimary}}</div>',
  errorLinkTo: null,
  onErrorHandle: () => {},
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  data: {
    phoneNumber: {
      value: '+64 02 9374 8509',
    },
    isPrimary: {
      value: true, // expected error -> has a number throw error
    },
    ocSms: {
      value: true,
    },
    fields: {
      value: {
        isPreferred: { text: 'Primary contact number' },
        isSmsEnabled: { text: 'SMS alerts enabled' },
      },
    },
  },
};
mobile.storyName = 'Mobile';

export const mobileError = Template.bind({});
mobileError.args = {
  missingTag: 'phoneNumber',
  id: 'mobile',
  title: 'Mobile',
  value:
    '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}</div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>{{/isPrimary}}</div>',
  errorLinkTo: null,
  onErrorHandle: missingTag => {
    alert(`missing: ${missingTag}`);
  },
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  data: {
    phoneNumber: {
      value: null,
    },
    isPrimary: {
      value: true, // expected error -> has a number throw error
    },
    ocSms: {
      value: true,
    },
    fields: {
      value: {
        isPreferred: { text: 'Primary contact number' },
        isSmsEnabled: { text: 'SMS alerts enabled' },
      },
    },
  },
};
mobileError.storyName = 'Mobile Error';

export const address = Template.bind({});
address.args = {
  id: 'address',
  title: 'Address',
  value: `<div>
  <span>{{street1}}</span>
  </div>
  {{#street2}}
  <span>{{street2}}</span>
  {{/street2}}
  <div>
  <span>{{city}}</span>,
  <span>{{state}}</span> ,
  <span>{{zip}}</span>
  </div>
  <div>
  <span>{{country}}</span>
  </div>`,

  errorLinkTo: null,
  onErrorHandle: () => {},
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  data: {
    street1: {
      value: '1 example st',
    },
    street2: {
      value: null,
    },
    city: {
      value: 'Sydney',
    },
    state: {
      value: 'NSW',
    },
    zip: {
      value: '2000',
    },
    country: {
      value: 'Australia',
    },
  },
};
address.storyName = 'Address';

export const addressError = Template.bind({});
addressError.args = {
  missingTag: 'street1',
  id: 'address',
  title: 'Address',
  value: `<div>
    <span>{{street1}}</span>
    </div>
    {{#street2}}
    <span>{{street2}}</span>
    {{/street2}}
    <div>
    <span>{{city}}</span>,
    <span>{{state}}</span> ,
    <span>{{zip}}</span>
    </div>
    <div>
    <span>{{country}}</span>
    </div>`,
  validators: [
    {
      apifield: 'street1',
      type: 'predefined',
      key: 'required',
      message: 'aboutMe.adaptiveForm.firstname.validation.required',
    },
    {
      apifield: 'street2',
      type: 'predefined',
      key: 'required',
      message: 'aboutMe.adaptiveForm.firstname.validation.required',
    },
    {
      apifield: 'city',
      type: 'predefined',
      key: 'required',
      message: 'aboutMe.adaptiveForm.firstname.validation.required',
    },
    {
      apifield: 'state',
      type: 'predefined',
      key: 'required',
      message: 'aboutMe.adaptiveForm.firstname.validation.required',
    },
    {
      apifield: 'zip',
      type: 'predefined',
      key: 'required',
      message: 'aboutMe.adaptiveForm.firstname.validation.required',
    },
    {
      apifield: 'country',
      type: 'predefined',
      key: 'required',
      message: 'aboutMe.adaptiveForm.firstname.validation.required',
    },
  ],
  errorLinkTo: null,
  onErrorHandle: missingTag => {
    alert(`missing: ${missingTag}`);
  },
  clkErrorLabel: 'Edit missing information',
  errorLabel: 'Missing information',
  data: {
    street1: {
      value: '1 example st',
    },
    street2: {
      value: null,
    },
    city: {
      value: 'Sydney',
    },
    state: {
      value: 'NSW',
    },
    zip: {
      value: '2000',
    },
    country: {
      value: null,
    },
  },
};
addressError.storyName = 'Country Error';

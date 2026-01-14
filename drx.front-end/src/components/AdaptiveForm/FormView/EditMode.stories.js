/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
//import mapAccountConfig from '../../../utils/adaptiveForm/mapAccountConfig';
import StoryRouter from 'storybook-react-router';
import { labels } from '../_mock';
import EditMode from './EditMode';
import { formViewConfig, formData } from './_mock';

export default {
  title: 'Adaptive Form/Form View/EditMode',
  component: EditMode,
  decorators: [StoryRouter()],
};

const Template = args => <EditMode {...args} />;

export const componentDefault = Template.bind({});

componentDefault.args = {
  data: formData,
  labels,
  // config: { ...formViewConfig.edit },
  config: {
    saveLabel: 'labels.af.buttons.buttonBar.save',
    cancelLabel: 'labels.af.buttons.buttonBar.cancel',
    savingLabel: 'labels.af.buttons.buttonBar.saving',
    savedLabel: 'labels.af.buttons.buttonBar.saved',
    edit: 'labels.af.actionBar.buttons.edit',
    cancel: 'labels.af.actionBar.buttons.cancel',
    title: 'labels.af.title.personal',
    fallbackTitle: 'labels.af.title.personal2',
    submissionUrl: '/patients/me',
    submissionModel: 'personal',
    mask: 'mmmm dd yyyy',
    elements: [
      {
        id: 'firstname',
        label: 'labels.af.personal.edit.firstname.label',
        apifield: 'firstName',
        type: 'textfield',
        placeholder: 'labels.af.personal.edit.firstname.placeholder',
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
        placeholder: 'labels.af.personal.edit.lastname.placeholder',
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
        dateFormat: 'dmy',
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
            message: 'labels.af.fields.date.validation.dateIsPast',
          },
        ],
      },
    ],
  },
};

componentDefault.storyName = 'default';

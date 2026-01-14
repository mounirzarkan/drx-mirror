/* eslint-disable react/jsx-props-no-spreading */
import StoryRouter from 'storybook-react-router';
import React from 'react';
import EditMode from './EditMode';
import { phoneNumbersViewConfig, phoneNumbers } from './_mock';
import { labels } from '../_mock';

export default {
  title: 'Adaptive Form/List View/EditMode',
  component: EditMode,
  decorators: [StoryRouter()],
};

const Template = args => <EditMode {...args} />;

export const ListView_default = Template.bind({});

ListView_default.args = {
  labels,
  // config: phoneNumbersViewConfig.edit,
  config: {
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
        placeholder: 'labels.af.contact.edit.phoneNumber.placeholder',
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
    country: 'US',
    type: 'List',
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
  },
  data: phoneNumbers,
};

ListView_default.storyName = 'default';

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { labels } from '../_mock';
import FormView from './FormView';
//import mapAccountConfig from '../../../utils/adaptiveForm/mapAccountConfig';

import { formData, formViewConfig } from './_mock';

export default {
  title: 'Adaptive Form/Form View/Container',
  component: FormView,
};

const Template = args => <FormView {...args} />;

export const componentDefault = Template.bind({});
componentDefault.args = {
  // config: formViewConfig,
  data: formData,
  config: {
    country: 'US',
    language: 'en',
    mask: 'mmmm dd yyyy',
    id: 'personalView',
    title: 'labels.af.title.personal',
    fallbackTitle: 'labels.af.title.personal2',
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
    isEdit: '',
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOiI0MTgwOWY0Zi00MzdmLTQzZWMtYmZkNS0xYzE2NWQwNDc0ZGQiLCJnaXZlbl9uYW1lIjoiRWR3YXJkIiwiZmFtaWx5X25hbWUiOiJHcmFudCIsImxvY2FsZSI6ImVuX1VTIiwiYXV0aF90aW1lIjoxNjM4NzUzMDI5LCJodHRwczovL3d3dy5jb2NobGVhci5jb20vY291bnRyeV9jb2RlIjoiVVMiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vdXNlcl90eXBlIjoiQ2FyZXIiLCJodHRwczovL3d3dy5jb2NobGVhci5jb20vc2ZfdG9rZW4iOiI2ZjE4MzcwZmNhM2U4M2RiOWExNmM0N2U2OTg0ZThmZTQyNTE2ZTZmZDFlMjg4NWEzNGZkZWM4YmE0MDE4YjdmJTJGN05rNyUyRnJSVllrRTl0YmhsTCUyRnBSTE8lMkJIZmI1VjhyZFYxY2lRZHk0U1d2QUtyTDRHQUtiSlhGa0lEaUQ2UUdkUm9FVVRoemlsc3Y1MHhCcjhsTUdGWnYlMkY0Y1E5WlJaJTJGWWJkWWZ4RkN0N3lzbUtaTjRvVUFPM0IybjltV1N0UWpvY0tRS1BHbkVQMTFuZkxTdDR1RjQ4NHpuaTg4RXRoWHV1JTJCdmhBcDBLMzQlM0QzOTI0MzI5MTExMmU1NjMxZGY2ZWFmNmY3YTA2ODJjMmQ0M2RkOWIyYzAwNDkzZGVmNTAwMTcxMjUwMzVmODJlIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL2FwcCI6InVoLGRtLHN0b3JlIiwiaHR0cHM6Ly93d3cuY29jaGxlYXIuY29tL3JlY2lwaWVudCI6Ilt7XCJmaXJzdE5hbWVcIjpcIkFkcmllbm5lXCIsXCJsYXN0TmFtZVwiOlwiR3JhbnRcIixcIkNvY2hsZWFySWRcIjpcImEyZmVmMGQyOTkyNzQxMWNkMmFhMWU1NGIzZWY2Yzc2OWFhOWM3MzU1NThjZTcwN2JkM2Y0MjZjNzBkODQwMDRWTExld2hqRDglMkJPUVJobVAzYUdZSFElM0QlM0Q3NTYwMTcwMTU1ZWQ5ZTk2NmViNzgzZGQ2NDY1YjBiODliOThjMzhlYjU5NzNlMGEwNjAyMGM4MjVmZjY5Mzg3XCJ9XSIsImlhdCI6MTYzODc1MzAzMiwiZXhwIjoxNjM5OTYyNjMyLCJpc3MiOiJodHRwczovL3d3dy5jb2NobGVhci5jb20iLCJzdWIiOiJjZjg4OGViZjQ2OWMxYTNhYTVlN2JhZWJjN2I2ZjFlZmNlZThiZDUyOTQ2MjQ3Zjk5ZDc5Njk5MGI1MmFjZWI2QVVzeDh3SE53c2l3ZU5kTXRWSlE2USUzRCUzRDMxNmQzNTNjY2E1YTVlMDllZjAwNWQ2MmJmZTM5Y2ZlODY3Yzg1YWEwNDhjOGY2ZjQ0NTc1NjFiMzYyMWYzZDYiLCJqdGkiOiI2YmIzZTQ2My0xY2M2LTQ0ZjktOTA0MS1lOTJkZGJmNjQzMzIifQ.CyNkixgmO0OD_U41KlyEHTmUb271PznfhfJRkkB9u9bHBGPPHfFIIg7_q-Ke4u5tsWzhjCrR4TRGS_W2tQGSQeK1i0c6jr8kniVNL1XBHA3w6Fxff5b5BKeRPiWmJOtV3GTmp20b3DcpHiYGmirOCwi61G8y5UYpXdasngE_KZoRFsB9KK5NCWiknml-TG6g39gkuoWK2LOGje7YcTZuQnClr8wFY1l_CdD_zqgaU1M2oldfersHHnnJKYhP4tf4j48bdbWRUNleTp-O8XHsxFgCacvwZ99BaLaaM6pTVfqjdzfn3LSI6YJjL3fksY6ATDxYbWcCuFJqKrg-r8ljrg',
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
            'cf888ebf469c1a3aa5e7baebc7b6f1efcee8bd52946247f99d796990b52aceb6AUsx8wHNwsiweNdMtVJQ6Q%3D%3D316d353cca5a5e09ef005d62bfe39cfe867c85aa048c8f6f4457561b3621f3d6',
        },
        {
          firstName: 'Adrienne',
          lastName: 'Grant',
          tabIndex: 1,
          type: 'Recipient',
          userId:
            'a2fef0d29927411cd2aa1e54b3ef6c769aa9c735558ce707bd3f426c70d84004VLLewhjD8%2BOQRhmP3aGYHQ%3D%3D7560170155ed9e966eb783dd6465b0b89b98c38eb5973e0a06020c825ff69387',
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
  labels,
};
componentDefault.storyName = 'default';

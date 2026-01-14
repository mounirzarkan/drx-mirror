export function adaptiveFormsQuery(language, country) {
  return {
    tabs: {
      dateMask: {
        value: 'mmmm dd yyyy',
      },
      saveButton: {
        targetItem: {
          value: {
            value: 'labels.af.buttons.buttonBar.save',
          },
        },
      },
      saving: {
        targetItem: {
          value: {
            value: 'labels.af.buttons.buttonBar.saving',
          },
        },
      },
      saved: {
        targetItem: {
          value: {
            value: 'labels.af.buttons.buttonBar.saved',
          },
        },
      },
      cancelButton: {
        targetItem: {
          value: {
            value: 'labels.af.buttons.buttonBar.cancel',
          },
        },
      },
      editLink: {
        targetItem: {
          value: {
            value: 'labels.af.buttons.actionBar.edit',
          },
        },
      },
      cancelLink: {
        targetItem: {
          value: {
            value: 'labels.af.buttons.actionBar.cancel',
          },
        },
      },
      promptText: {
        targetItem: {
          value: {
            value: 'labels.tabs.promptText',
          },
        },
      },
      promptTextAbbrv: {
        targetItem: {
          value: {
            value: 'labels.tabs.promptTextAbbrv',
          },
        },
      },
      recipientTab: {
        targetItem: {
          value: {
            value: 'labels.tabs.tab2Type',
          },
        },
      },
      tabConfigs: [
        {
          name: 'A1',
          tabType: {
            value: 'Recipient',
          },
          userType: {
            value: 'Carer',
          },
          userAgeGroup: {
            value: 'not applicable',
          },
          addressRestricted: {
            boolValue: true,
          },
          hasCarer: {
            boolValue: false,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'firstname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'firstName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'lastname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'lastName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[^0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'date of birth',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.dob.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Datetime',
                      },
                      apiField: {
                        targetItem: {
                          name: 'dateOfBirth',
                        },
                      },
                      placeholder: {
                        targetItem: null,
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.edit.dob.hint',
                          },
                        },
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: {
                          name: 'DMY',
                        },
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'dateIsPast',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.dateIsPast',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'combinedView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.addressAndContact.label',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '',
              },
              submissionModel: {
                value: '',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'privacy message',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: null,
                      },
                      value: {
                        value:
                          'To maintain recipient privacy, address and phone contact details are not available.<br />\nIf you need to access or change this information contact our customer support team.<br />\n<p>\n<a href="tel:+1-877-651-7001" class="ccl-l-row-centered ccl__text--interactive-text" data-nw-error-link="phoneNumber" data-nw-action="call">\n<span style="margin-right: 4px;" class="ccl__icon ccl__icon--call--color__icon__interactive ccl__icon--size--sm"></span>\n877-651-7001\n</a>\n</p>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'A2',
          tabType: {
            value: 'Recipient',
          },
          userType: {
            value: 'Carer',
          },
          userAgeGroup: {
            value: 'not applicable',
          },
          addressRestricted: {
            boolValue: false,
          },
          hasCarer: {
            boolValue: false,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'firstname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'firstName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: true,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'lastname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'lastName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[^0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'date of birth',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.dob.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Datetime',
                      },
                      apiField: {
                        targetItem: {
                          name: 'dateOfBirth',
                        },
                      },
                      placeholder: {
                        targetItem: null,
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.edit.dob.hint',
                          },
                        },
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: {
                          name: 'DMY',
                        },
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'dateIsPast',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.dateIsPast',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'addressView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.address',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Address',
              },
              submissionUrl: {
                value: 'profile/v1/address',
              },
              submissionModel: {
                value: 'address',
              },
              states: [],
            },
            {
              Id: {
                value: 'contactView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.contact',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'List',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'contact',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'Mobile',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.mobile',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element"><div class="ccl__list-read-mode__element__value">\n{{phoneNumber}}\n</div>\n{{#ocSms}}\n<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>\n{{fields.isSmsEnabled.text}}\n</div>\n{{/ocSms}}\n\n{{#isPrimary}}\n\n<div class="ccl__list-read-mode__element__field">\n{{fields.isPreferred.text}}\n</div>\n\n{{/isPrimary}}\n\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Fax',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.fax',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Home',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.home',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Work',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.work',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'isPreferred',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isPreferred',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                    {
                      name: 'isSmsEnabled',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isSmsEnabled',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel',
                      },
                    },
                  },
                  phoneLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phoneLabel',
                      },
                    },
                  },
                  phonePromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phonePromptText',
                      },
                    },
                  },
                  countryLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryLabel',
                      },
                    },
                  },
                  countryPromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryPromptText',
                      },
                    },
                  },
                  nationalNumberLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.nationalNumberLabel',
                      },
                    },
                  },
                  preferredLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.preferredLabel',
                      },
                    },
                  },
                  ocSmsLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsLabel',
                      },
                    },
                  },
                  noOptionsMessage: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.noOptionsMessage',
                      },
                    },
                  },
                  elements: [
                    {
                      name: 'phoneNumber',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.input',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'phoneNumber',
                      },
                      apiField: {
                        targetItem: {
                          name: 'phoneNumber',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '10',
                      },
                      useStrictMode: {
                        boolValue: true,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: null,
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'phoneNumber',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Fax',
                          },
                          label: {
                            value: 'Fax',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Home',
                          },
                          label: {
                            value: 'Home',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Mobile',
                          },
                          label: {
                            value: 'Mobile',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Work',
                          },
                          label: {
                            value: 'Work',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'B1',
          tabType: {
            value: 'Carer',
          },
          userType: {
            value: 'Carer',
          },
          userAgeGroup: {
            value: 'not applicable',
          },
          addressRestricted: {
            boolValue: false,
          },
          hasCarer: {
            boolValue: false,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'firstname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'firstName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: true,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'lastname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'lastName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[^0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'date of birth',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.dob.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Datetime',
                      },
                      apiField: {
                        targetItem: {
                          name: 'dateOfBirth',
                        },
                      },
                      placeholder: {
                        targetItem: null,
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.edit.dob.hint',
                          },
                        },
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: {
                          name: 'DMY',
                        },
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: null,
                          },
                          type: {
                            value: '',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: null,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'addressView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.address',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Address',
              },
              submissionUrl: {
                value: 'profile/v1/address',
              },
              submissionModel: {
                value: 'address',
              },
              states: [],
            },
            {
              Id: {
                value: 'contactView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.contact',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'List',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'contact',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'Mobile',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.mobile',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Fax',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.fax',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Home',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.home',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Work',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.work',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'isPreferred',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isPreferred',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                    {
                      name: 'isSmsEnabled',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isSmsEnabled',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel',
                      },
                    },
                  },
                  phoneLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phoneLabel',
                      },
                    },
                  },
                  phonePromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phonePromptText',
                      },
                    },
                  },
                  countryLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryLabel',
                      },
                    },
                  },
                  countryPromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryPromptText',
                      },
                    },
                  },
                  nationalNumberLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.nationalNumberLabel',
                      },
                    },
                  },
                  preferredLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.preferredLabel',
                      },
                    },
                  },
                  ocSmsLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsLabel',
                      },
                    },
                  },
                  noOptionsMessage: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.noOptionsMessage',
                      },
                    },
                  },
                  elements: [
                    {
                      name: 'phoneNumber',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.input',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'phoneNumber',
                      },
                      apiField: {
                        targetItem: {
                          name: 'phoneNumber',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '10',
                      },
                      useStrictMode: {
                        boolValue: true,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: null,
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'phoneNumber',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Fax',
                          },
                          label: {
                            value: 'Fax',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Home',
                          },
                          label: {
                            value: 'Home',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Mobile',
                          },
                          label: {
                            value: 'Mobile',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Work',
                          },
                          label: {
                            value: 'Work',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'C1',
          tabType: {
            value: 'Recipient',
          },
          userType: {
            value: 'Recipient',
          },
          userAgeGroup: {
            value: 'older than update age',
          },
          addressRestricted: {
            boolValue: false,
          },
          hasCarer: {
            boolValue: true,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'firstname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'firstName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: true,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'lastname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'lastName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[^0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'date of birth',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.dob.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Datetime',
                      },
                      apiField: {
                        targetItem: {
                          name: 'dateOfBirth',
                        },
                      },
                      placeholder: {
                        targetItem: null,
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.edit.dob.hint',
                          },
                        },
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: {
                          name: 'DMY',
                        },
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'dateIsPast',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.dateIsPast',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'addressView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.address',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Address',
              },
              submissionUrl: {
                value: 'profile/v1/address',
              },
              submissionModel: {
                value: 'address',
              },
              states: [],
            },
            {
              Id: {
                value: 'contactView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.contact',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'List',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'contact',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'Mobile',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.mobile',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Fax',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.fax',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Home',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.home',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Work',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.work',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'isPreferred',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isPreferred',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                    {
                      name: 'isSmsEnabled',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isSmsEnabled',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel',
                      },
                    },
                  },
                  phoneLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phoneLabel',
                      },
                    },
                  },
                  phonePromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phonePromptText',
                      },
                    },
                  },
                  countryLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryLabel',
                      },
                    },
                  },
                  countryPromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryPromptText',
                      },
                    },
                  },
                  nationalNumberLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.nationalNumberLabel',
                      },
                    },
                  },
                  preferredLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.preferredLabel',
                      },
                    },
                  },
                  ocSmsLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsLabel',
                      },
                    },
                  },
                  noOptionsMessage: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.noOptionsMessage',
                      },
                    },
                  },
                  elements: [
                    {
                      name: 'phoneNumber',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.input',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'phoneNumber',
                      },
                      apiField: {
                        targetItem: {
                          name: 'phoneNumber',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '10',
                      },
                      useStrictMode: {
                        boolValue: true,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: null,
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'phoneNumber',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Fax',
                          },
                          label: {
                            value: 'Fax',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Home',
                          },
                          label: {
                            value: 'Home',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Mobile',
                          },
                          label: {
                            value: 'Mobile',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Work',
                          },
                          label: {
                            value: 'Work',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'carersView',
              },
              title: {
                targetItem: null,
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.carers',
                  },
                },
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '',
              },
              submissionModel: {
                value: '',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{displayValue}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'C2',
          tabType: {
            value: 'Recipient',
          },
          userType: {
            value: 'Recipient',
          },
          userAgeGroup: {
            value: 'younger than update age',
          },
          addressRestricted: {
            boolValue: false,
          },
          hasCarer: {
            boolValue: true,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'addressView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.address',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'Address',
              },
              submissionUrl: {
                value: 'profile/v1/address',
              },
              submissionModel: {
                value: 'address',
              },
              states: [],
            },
            {
              Id: {
                value: 'contactView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.contact',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'List',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'contact',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'Mobile',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.mobile',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Fax',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.fax',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Home',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.home',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Work',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.work',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'isPreferred',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isPreferred',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                    {
                      name: 'isSmsEnabled',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isSmsEnabled',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'carersView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.carers',
                  },
                },
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '',
              },
              submissionModel: {
                value: '',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{displayValue}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'D1',
          tabType: {
            value: 'Recipient',
          },
          userType: {
            value: 'Recipient',
          },
          userAgeGroup: {
            value: 'older than update age',
          },
          addressRestricted: {
            boolValue: false,
          },
          hasCarer: {
            boolValue: false,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'firstname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'firstName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: true,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'lastname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'lastName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[^0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'date of birth',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.dob.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Datetime',
                      },
                      apiField: {
                        targetItem: {
                          name: 'dateOfBirth',
                        },
                      },
                      placeholder: {
                        targetItem: null,
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.edit.dob.hint',
                          },
                        },
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: {
                          name: 'DMY',
                        },
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'dateIsPast',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: null,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'addressView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.address',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Address',
              },
              submissionUrl: {
                value: 'profile/v1/address',
              },
              submissionModel: {
                value: 'address',
              },
              states: [],
            },
            {
              Id: {
                value: 'contactView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.contact',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'List',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'contact',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'Mobile',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.mobile',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Fax',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.fax',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Home',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.home',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Work',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.work',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'isPreferred',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isPreferred',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                    {
                      name: 'isSmsEnabled',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isSmsEnabled',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel',
                      },
                    },
                  },
                  phoneLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phoneLabel',
                      },
                    },
                  },
                  phonePromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phonePromptText',
                      },
                    },
                  },
                  countryLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryLabel',
                      },
                    },
                  },
                  countryPromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryPromptText',
                      },
                    },
                  },
                  nationalNumberLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.nationalNumberLabel',
                      },
                    },
                  },
                  preferredLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.preferredLabel',
                      },
                    },
                  },
                  ocSmsLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsLabel',
                      },
                    },
                  },
                  noOptionsMessage: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.noOptionsMessage',
                      },
                    },
                  },
                  elements: [
                    {
                      name: 'phoneNumber',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.input',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'phoneNumber',
                      },
                      apiField: {
                        targetItem: {
                          name: 'phoneNumber',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '10',
                      },
                      useStrictMode: {
                        boolValue: true,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: null,
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'phoneNumber',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Fax',
                          },
                          label: {
                            value: 'Fax',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Home',
                          },
                          label: {
                            value: 'Home',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Mobile',
                          },
                          label: {
                            value: 'Mobile',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Work',
                          },
                          label: {
                            value: 'Work',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'D2',
          tabType: {
            value: '',
          },
          userType: {
            value: 'Carer',
          },
          userAgeGroup: {
            value: 'older than update age',
          },
          addressRestricted: {
            boolValue: false,
          },
          hasCarer: {
            boolValue: false,
          },
          sections: [
            {
              Id: {
                value: 'personalView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal',
                  },
                },
              },
              fallbackTitle: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.personal2',
                  },
                },
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'Form',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'personal',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'name',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.name',
                          },
                        },
                      },
                      value: {
                        value: '{{firstName}} {{lastName}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'dob',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.read.dob',
                          },
                        },
                      },
                      value: {
                        value: '{{dateOfBirth}}',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: 'dd mmmm yyyy',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'firstname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'firstName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.firstname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: true,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'firstName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.firstname.validation.required',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'lastname',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Textfield',
                      },
                      apiField: {
                        targetItem: {
                          name: 'lastName',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.lastname.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'lastName',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[^0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.personal.edit.lastname.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'date of birth',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.personal.edit.dob.label',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'Datetime',
                      },
                      apiField: {
                        targetItem: {
                          name: 'dateOfBirth',
                        },
                      },
                      placeholder: {
                        targetItem: null,
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: {
                          field: {
                            value: 'labels.af.personal.edit.dob.hint',
                          },
                        },
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: {
                          name: 'DMY',
                        },
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '',
                      },
                      useStrictMode: {
                        boolValue: false,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.invalid',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'dateOfBirth',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'dateIsPast',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.fields.date.validation.dateIsPast',
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              Id: {
                value: 'addressView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.address',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readOnly',
              },
              type: {
                value: 'Address',
              },
              submissionUrl: {
                value: 'profile/v1/address',
              },
              submissionModel: {
                value: 'address',
              },
              states: [],
            },
            {
              Id: {
                value: 'contactView',
              },
              title: {
                targetItem: {
                  value: {
                    value: 'labels.af.title.contact',
                  },
                },
              },
              fallbackTitle: {
                targetItem: null,
              },
              mode: {
                value: 'readWrite',
              },
              type: {
                value: 'List',
              },
              submissionUrl: {
                value: '/v1/patients/me',
              },
              submissionModel: {
                value: 'contact',
              },
              states: [
                {
                  name: 'read',
                  clkErrorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.clk',
                      },
                    },
                  },
                  errorLabel: {
                    targetItem: {
                      field: {
                        value: 'labels.af.personal.read.error.label',
                      },
                    },
                  },
                  smsInformation: null,
                  phoneLabel: null,
                  phonePromptText: null,
                  countryLabel: null,
                  countryPromptText: null,
                  nationalNumberLabel: null,
                  preferredLabel: null,
                  ocSmsLabel: null,
                  noOptionsMessage: null,
                  elements: [
                    {
                      name: 'Mobile',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.mobile',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n<div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>\n{{#isPrimary}}\n<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n{{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Fax',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.fax',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Home',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.home',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'Work',
                      template: {
                        name: 'ReadField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.title.work',
                          },
                        },
                      },
                      value: {
                        value:
                          '<div class="ccl__list-read-mode__element">\n    <div class="ccl__list-read-mode__element__value">{{phoneNumber}}</div>{{#ocSms}}<div class="ccl__list-read-mode__element__field"><span class="ccl__icon ccl__icon--circled-check--color__icon__success ccl__icon--size--rg"></span>{{fields.isSmsEnabled.text}}\n    </div>{{/ocSms}}{{#isPrimary}}<div class="ccl__list-read-mode__element__field">{{fields.isPreferred.text}}</div>\n    {{/isPrimary}}\n</div>',
                      },
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: {
                        value: '',
                      },
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'required',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: {
                              name: 'phoneNumber',
                            },
                          },
                          type: {
                            value: 'mask',
                          },
                          key: {
                            value: '',
                          },
                          mask: {
                            value: '/^[+ 0-9]+$/',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.mask',
                              },
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: 'isPreferred',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isPreferred',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                    {
                      name: 'isSmsEnabled',
                      template: {
                        name: 'ReadField Field',
                      },
                      text: {
                        targetItem: {
                          field: {
                            value: 'labels.af.contact.isSmsEnabled',
                          },
                        },
                      },
                      label: null,
                      value: null,
                      type: null,
                      apiField: null,
                      placeholder: null,
                      optionalLabel: null,
                      hint: null,
                      defaultValue: null,
                      format: null,
                      dateFormat: null,
                      hidden: null,
                      phoneNumberlength: null,
                      useStrictMode: null,
                      validators: [],
                    },
                  ],
                },
                {
                  name: 'edit',
                  clkErrorLabel: null,
                  errorLabel: null,
                  smsInformation: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel',
                      },
                    },
                  },
                  phoneLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phoneLabel',
                      },
                    },
                  },
                  phonePromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.phonePromptText',
                      },
                    },
                  },
                  countryLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryLabel',
                      },
                    },
                  },
                  countryPromptText: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.countryPromptText',
                      },
                    },
                  },
                  nationalNumberLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.nationalNumberLabel',
                      },
                    },
                  },
                  preferredLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.preferredLabel',
                      },
                    },
                  },
                  ocSmsLabel: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.ocSmsLabel',
                      },
                    },
                  },
                  noOptionsMessage: {
                    targetItem: {
                      field: {
                        value:
                          'labels.af.contact.edit.phoneNumber.noOptionsMessage',
                      },
                    },
                  },
                  elements: [
                    {
                      name: 'phoneNumber',
                      template: {
                        name: 'EditField Element',
                      },
                      text: null,
                      label: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.input',
                          },
                        },
                      },
                      value: null,
                      type: {
                        value: 'phoneNumber',
                      },
                      apiField: {
                        targetItem: {
                          name: 'phoneNumber',
                        },
                      },
                      placeholder: {
                        targetItem: {
                          field: {
                            value:
                              'labels.af.contact.edit.phoneNumber.placeholder',
                          },
                        },
                      },
                      optionalLabel: {
                        targetItem: null,
                      },
                      hint: {
                        targetItem: null,
                      },
                      defaultValue: {
                        value: '',
                      },
                      format: {
                        value: '',
                      },
                      dateFormat: {
                        targetItem: null,
                      },
                      hidden: {
                        boolValue: false,
                      },
                      phoneNumberlength: {
                        value: '10',
                      },
                      useStrictMode: {
                        boolValue: true,
                      },
                      validators: [
                        {
                          template: {
                            name: 'FieldValidator',
                          },
                          value: null,
                          label: null,
                          apiField: {
                            targetItem: null,
                          },
                          type: {
                            value: 'predefined',
                          },
                          key: {
                            value: 'phoneNumber',
                          },
                          mask: {
                            value: '',
                          },
                          message: {
                            targetItem: {
                              field: {
                                value:
                                  'labels.af.contact.edit.phoneNumber.validation.required',
                              },
                            },
                          },
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Fax',
                          },
                          label: {
                            value: 'Fax',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Home',
                          },
                          label: {
                            value: 'Home',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Mobile',
                          },
                          label: {
                            value: 'Mobile',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                        {
                          template: {
                            name: 'FieldOption',
                          },
                          value: {
                            value: 'Work',
                          },
                          label: {
                            value: 'Work',
                          },
                          apiField: null,
                          type: null,
                          key: null,
                          mask: null,
                          message: null,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

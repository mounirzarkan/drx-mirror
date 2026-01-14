/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReadMode from './ReadMode';

export default {
  title: 'Adaptive Form/Form View/ReadMode',
  component: ReadMode,
};

const Template = args => <ReadMode {...args} />;

export const US = Template.bind({});
US.args = {
  config: {
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
  labels: {
    'labels.af.actionBar.buttons.cancel': 'Cancel',
    'labels.af.actionBar.buttons.edit': 'Edit',
    'labels.af.actionBar.popup.message':
      "You’re up to date, <br class='is-hidden-tablet' />why not check your recipients?",
    'labels.af.actionbar.popup.multipleRecipientsMe':
      "You’re up to date, <br class='is-hidden-tablet' />why not check your recipients?",
    'labels.af.actionbar.popup.multipleRecipientsOther':
      "{{firstName}} is up to date, <br class='is-hidden-tablet' />why not check everybody?",
    'labels.af.actionbar.popup.singleRecipientMe':
      "You’re up to date, <br class='is-hidden-tablet' />why not check {{firstName}}’s details?",
    'labels.af.actionbar.popup.singleRecipientOther':
      "{{firstName}} is up to date, <br class='is-hidden-tablet' />why not check your details?",
    'labels.af.buttons.buttonBar.cancel': 'Cancel',
    'labels.af.buttons.buttonBar.save': 'Save',
    'labels.af.buttons.buttonBar.saved': 'Saved!',
    'labels.af.buttons.buttonBar.saving': 'Saving...',
    'labels.af.personal.read.error.clk': 'Edit missing information',
    'labels.af.personal.read.error.contact.clk':
      'Edit missing contact information',
    'labels.af.personal.read.error.contact.label':
      'Missing contact information',
    'labels.af.personal.read.error.label': 'Missing information',
    'labels.af.fields.date.validation.dateIsFuture':
      'date needs to be greater than today',
    'labels.af.fields.date.validation.dateIsPast':
      'date needs to be smaller than today',
    'labels.af.fields.date.validation.invalid': 'date is invalid',
    'labels.af.fields.date.validation.required': '',
    'labels.af.fields.date.day.validation.range':
      'day should be smaller than 31',
    'labels.af.fields.date.day.validation.required':
      'Day is missing ',
    'labels.af.fields.date.month.validation.range':
      'month should be smaller than 12',
    'labels.af.fields.date.month.validation.required':
      'Month is missing',
    'labels.af.fields.date.year.validation.range':
      'year should be bigger than 1800',
    'labels.af.fields.date.year.validation.required':
      'Year is missing',
    'labels.af.fields.date.yearLabel': 'YYYY',
    'labels.af.fields.date.monthLabel': 'MM',
    'labels.af.fields.date.dayLabel': 'DD',
    'labels.af.addressAndContact.label':
      'Address and contact details',
    'labels.af.title.personal': "{{name}}'s Details",
    'labels.af.title.personal2': 'Personal Details',
    'labels.af.title.address': 'Address details',
    'labels.af.title.carers': 'Carer details',
    'labels.af.title.carerTitle': 'My details',
    'labels.af.title.contact': 'Contact details',
    'labels.af.title.recipientTitle': 'Personal details',
    'labels.af.contact.title.fax': 'Fax',
    'labels.af.contact.title.home': 'Home',
    'labels.af.contact.title.mobile': 'Mobile',
    'labels.af.contact.title.phone': 'Phone',
    'labels.af.contact.title.work': 'Work',
    'labels.af.contact.edit.phoneNumber.countryLabel': 'Country code',
    'labels.af.contact.edit.phoneNumber.countryPromptText':
      'Select...',
    'labels.af.contact.edit.phoneNumber.nationalNumberLabel':
      'Area code and phone number',
    'labels.af.contact.edit.phoneNumber.noOptionsMessage':
      'No matching options',
    'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel':
      'Allow SMS alerts: Sign-up to receive service-related text messages about your orders, warranty information and more. Message and data rates may apply. Learn more about Cochlear’s Privacy Policy at <a href="https://www.cochlear.com/privacy">www.cochlear.com/privacy</a>',
    'labels.af.contact.edit.phoneNumber.ocSmsLabel':
      'Allow SMS alerts',
    'labels.af.contact.edit.phoneNumber.phoneLabel': 'Number type',
    'labels.af.contact.edit.phoneNumber.phonePromptText': 'Select...',
    'labels.af.contact.edit.phoneNumber.placeholder': '????',
    'labels.af.contact.edit.phoneNumber.preferredLabel':
      'Preferred contact number',
    'labels.af.contact.edit.phoneNumber.input': '???',
    'labels.af.contact.edit.phoneNumber.nationalNumber.validation.invalid':
      'Invalid area code and number',
    'labels.af.contact.edit.phoneNumber.validation.mask':
      'Phone number is invalid',
    'labels.af.contact.edit.phoneNumber.validation.required':
      'Phone number is required ',
    'labels.af.contact.edit.phoneNumber.countrycode.validation.required':
      'Missing country code',
    'labels.af.contact.edit.phoneNumber.nationalNumber.validation.required':
      'Missing area code and number',
    'labels.af.contact.edit.phoneNumber.numberType.validation.required':
      'Missing number type',
    'labels.af.contact.isPreferred': 'Preferred contact number',
    'labels.af.contact.isSmsEnabled': 'SMS alerts enabled',
    'labels.af.personal.edit.dob.hint':
      'Day, month, year, eg. 12 02 1982',
    'labels.af.personal.edit.dob.label': 'Date of birth',
    'labels.af.personal.edit.dob.mm': '',
    'labels.af.personal.edit.dob.dd': '',
    'labels.af.personal.edit.dob.yyyy': 'YYYY',
    'labels.af.personal.edit.firstname.label': 'First name',
    'labels.af.personal.edit.firstname.placeholder': '',
    'labels.af.personal.edit.firstname.validation.mask':
      'First name cannot contain numbers',
    'labels.af.personal.edit.firstname.validation.required':
      'First name is missing',
    'labels.af.personal.edit.lastname.label': 'Last name',
    'labels.af.personal.edit.lastname.placeholder': '',
    'labels.af.personal.edit.lastname.validation.mask':
      'Last name cannot contain numbers',
    'labels.af.personal.edit.lastname.validation.required':
      'Last name is missing',
    'labels.af.personal.read.dob': 'Date of birth',
    'labels.af.personal.read.name': 'Name',
    'labels.address.edit.lookupErrorLabel':
      'Your residential address is missing. Enter your address above.',
    'labels.address.edit.hint': '',
    'labels.address.edit.loading': 'Loading... ',
    'labels.address.edit.optional': '',
    'labels.address.edit.prompt':
      'Start typing your address then select from list... ',
    'labels.address.edit.promptMobile':
      'Start typing your address ... ',
    'labels.address.edit.country.hint':
      ' If you need to change your address to a different country, please call our customer support team on 1800 444 for assistance. ',
    'labels.address.edit.country.label': 'Country of residence ',
    'labels.address.edit.country.optional': '',
    'labels.address.edit.country.prompt': '',
    'labels.address.edit.country.validation.required': 'required',
    'labels.address.edit.street1.hint': '',
    'labels.address.edit.street1.label': 'Address line 1 ',
    'labels.address.edit.street1.optional': '',
    'labels.address.edit.street1.prompt': '',
    'labels.address.edit.street1.validation.required':
      'Missing address line',
    'labels.address.edit.street2.hint': '',
    'labels.address.edit.street2.label': 'Address line 2 ',
    'labels.address.edit.street2.optional': 'optional ',
    'labels.address.edit.street2.prompt': '',
    'labels.address.edit.street2.validation.required':
      'Missing address line',
    'labels.address.edit.postalCode.hint': '',
    'labels.address.edit.postalCode.label': 'Zip ',
    'labels.address.edit.postalCode.optional': '',
    'labels.address.edit.postalCode.prompt': '',
    'labels.address.edit.postalCode.validation.invalidZip':
      'Invalid zip',
    'labels.address.edit.postalCode.validation.required':
      'Missing zip',
    'labels.address.edit.city.hint': '',
    'labels.address.edit.city.label': 'City ',
    'labels.address.edit.city.optional': '',
    'labels.address.edit.city.prompt': '',
    'labels.address.edit.city.validation.required': 'Missing city',
    'labels.address.edit.state.hint': '',
    'labels.address.edit.state.label': 'State ',
    'labels.address.edit.state.optional': '',
    'labels.address.edit.state.prompt': '',
    'labels.address.edit.state.validation.required': 'Missing state',
    'labels.address.edit.AddressNotFound.button':
      'Enter your address manually ',
    'labels.address.edit.AddressNotFound.text': 'Address not here? ',
    'labels.address.read.title': 'Address ',
    'labels.address.read.countrySupport':
      'If you need to change your address to a different country, please call our customer support team on +1-877-651-7001 for assistance. ',
    'labels.equipement.columnHeaders.model': '',
    'labels.equipement.columnHeaders.serialNo': '',
    'labels.equipement.columnHeaders.side': '',
    'labels.equipement.columnHeaders.warranty': '',
    'labels.equipement.rowGrouping.plus10years': '',
    'labels.equipement.rowGrouping.10years': '',
    'labels.equipement.rowGrouping.5years': '',
    'labels.equipement.rowGrouping.6months': '',
    'labels.equipement.rowGrouping.1month': '',
    'labels.equipement.rowGrouping.1year': '',
    '': '',
    'labels.error.buttons.home': 'Cochlear home',
    'labels.error.code.label': 'Error code',
    'labels.tabs.promptText': 'Select a recipient...',
    'labels.tabs.promptTextAbbrv': 'recipient...',
    'labels.tabs.tab2Type': 'recipient',
    'labels.orders.cellDetails.each': 'each',
    'labels.orders.cellDetails.part': 'Part',
    'labels.orders.cellDetails.status': 'Status',
    'labels.orders.columnHeaders.amount': 'Total',
    'labels.orders.columnHeaders.description': 'Description',
    'labels.orders.columnHeaders.detailedInformation': 'Description',
    'labels.orders.columnHeaders.item': 'Item',
    'labels.orders.columnHeaders.orderDate': 'Order date',
    'labels.orders.columnHeaders.orderNumber': 'Order number',
    'labels.orders.columnHeaders.orderNumberOrderDate': 'Order/Date',
    'labels.orders.columnHeaders.partNumber': 'Part number',
    'labels.orders.columnHeaders.quantity': 'Qty',
    'labels.orders.columnHeaders.status': 'Status',
    'labels.orders.columnHeaders.total': 'Total',
    'labels.orders.columnHeaders.totalPrice': 'Total price',
    'labels.orders.columnHeaders.unitPrice': 'Unit price',
    'labels.orders.columnHeaders.view': 'view',
    'labels.orders.error.buttons.backToOrders': 'Back to orders',
    'labels.orders.error.buttons.home': 'Cochlear home',
    'labels.orders.error.buttons.tryAgain': 'Try again',
    'labels.orders.error.errorImageAlt': 'something went wrong',
    'labels.orders.header.items.order.between': '(ref ',
    'labels.orders.header.items.date': 'Order date:',
    'labels.orders.header.items.for': 'For:',
    'labels.orders.header.items.order': 'Order #:',
    'labels.orders.header.items.orderNumber': '(aka $placeholder$)',
    'labels.orders.header.items.status': 'Order status:',
    'labels.orders.orderlist.title': 'Orders',
    'labels.orders.states.cancelled': 'Cancelled',
    'labels.orders.states.inProgress': 'In Progress',
    'labels.orders.states.shipped': 'Shipped',
    'labels.tabs2.type.recipient': 'Recipients',
    'labels.orders.toolbar.currentText': 'Order:',
    'labels.orders.toolbar.items.next': 'Next',
    'labels.orders.toolbar.items.prev': 'Prev',
    'labels.orders.toolbar.items.print': 'Print',
    'labels.orders.total.items.amount': 'Order amount:',
    'labels.orders.total.items.charges': 'Charges:',
    'labels.orders.total.items.tax': 'Tax:',
    'labels.orders.total.items.total': 'Total:',
    'labels.orders.message':
      'You don’t have any orders from the past 60 days.',
    i18nStamp: 1638758509758,
  },
  data: {
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
      value: 'December 24 1963',
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
  },
};
US.storyName = 'example';

export const firstNameError = Template.bind({});
firstNameError.args = {
  config: {
    clkErrorLabel: 'aboutMe.adaptiveForm.read.clkError.label',
    errorLabel: 'aboutMe.adaptiveForm.read.error.label',
    elements: [
      {
        id: 'name',
        label: 'example.label.Name',
        value: '{{firstName}} {{lastName}}',
        validators: [
          {
            apifield: 'firstName',
            type: 'predefined',
            key: 'required',
            message:
              'aboutMe.adaptiveForm.phoneNumber.validation.required',
          },
          {
            apifield: 'lastName',
            type: 'predefined',
            key: 'required',
            message:
              'aboutMe.adaptiveForm.phoneNumber.validation.required',
          },
        ],
      },
      {
        id: 'dob',
        label: 'example.label.dob',
        value: '{{dateOfBirth}}',
        validators: [
          {
            apifield: 'dateOfBirth',
            type: 'predefined',
            key: 'required',
            message:
              'aboutMe.adaptiveForm.phoneNumber.validation.required',
          },
        ],
      },
    ],
  },
  labels: {
    'example.label.Name': 'Name',
    'example.label.dob': 'Date of birth',
    'aboutMe.adaptiveForm.read.clkError.label':
      'Edit missing information',
    'aboutMe.adaptiveForm.read.error.label': 'Missing information',
  },
  data: {
    firstName: {
      value: null,
    },
    lastName: {
      value: 'Kane',
    },
    dateOfBirth: {
      value: 'Sep 05, 1950',
    },
  },
};
firstNameError.storyName = 'error';

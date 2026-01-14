import { adaptiveFormsQuery } from '../../gql/adaptiveFormsQuery.mock';
import { mapTabScenarios } from '../../utils/adaptiveForm/mapTabScenarios';

export const labels = {
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
  'labels.af.fields.date.day.validation.required': 'Day is missing ',
  'labels.af.fields.date.month.validation.range':
    'month should be smaller than 12',
  'labels.af.fields.date.month.validation.required':
    'Month is missing',
  'labels.af.fields.date.year.validation.range':
    'year should be bigger than 1800',
  'labels.af.fields.date.year.validation.required': 'Year is missing',
  'labels.af.fields.date.yearLabel': 'YYYY',
  'labels.af.fields.date.monthLabel': 'MM',
  'labels.af.fields.date.dayLabel': 'DD',
  'labels.af.addressAndContact.label': 'Address and contact details',
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
  'labels.af.contact.edit.phoneNumber.countryPromptText': 'Select...',
  'labels.af.contact.edit.phoneNumber.nationalNumberLabel':
    'Area code and phone number',
  'labels.af.contact.edit.phoneNumber.noOptionsMessage':
    'No matching options',
  'labels.af.contact.edit.phoneNumber.ocSmsInfoLabel':
    'Allow SMS alerts: Sign-up to receive service-related text messages about your orders, warranty information and more. Message and data rates may apply. Learn more about Cochlear’s Privacy Policy at <a href="https://www.cochlear.com/privacy">www.cochlear.com/privacy</a>',
  'labels.af.contact.edit.phoneNumber.ocSmsLabel': 'Allow SMS alerts',
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
  'labels.address.edit.postalCode.validation.required': 'Missing zip',
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
  i18nStamp: 1638749554042,
};

export const tabsData = {
  accountId: '41809f4f-437f-43ec-bfd5-1c165d0474dd',
  userId: 0,
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
};

export const singleTabsData = {
  accountId: 'bcf6c5a6-bb2a-42f8-98a6-a4141708d4ef',
  userId: 0,
  labels: {
    promptText: 'Select a recipient...',
    promptTextAbbrv: 'recipient...',
    type: 'recipient',
  },
  tabs: [
    {
      firstName: 'Mao',
      lastName: 'Moua',
      tabIndex: 0,
      type: 'Recipient',
      userId:
        '3629acdba9cf8ed2aeb69ce361e5fe80654d997b513d7aae6937476a33c52daeS4bZgQwemliUsmv8OYY%2FbA%3D%3D79df24c6313d72d0a1b4ce0ce90e3066eb35aaf59d23aaa98b88bba71845748e',
    },
  ],
};

export const US_scRoot = adaptiveFormsQuery('en', 'US');
export const US_scenarios = mapTabScenarios(
  'en',
  'US',
  US_scRoot.tabs,
);
export const US_address =
  US_scenarios.formConfig.tabConfigs[1].sections[1];
export const US_personal =
  US_scenarios.formConfig.tabConfigs[1].sections[0];
export const US_addressAndContactConfig =
  US_scenarios.formConfig.tabConfigs[0].sections[1];
export const US_contact =
  US_scenarios.formConfig.tabConfigs[1].sections[2];
export const US_carer =
  US_scenarios.formConfig.tabConfigs[3].sections[3];

export const PR_scRoot = adaptiveFormsQuery('en', 'PR');
export const PR_scenarios = mapTabScenarios(
  'en',
  'PR',
  PR_scRoot.tabs,
);
export const PR_address =
  PR_scenarios.formConfig.tabConfigs[1].sections[1];

export const CA_scRoot = adaptiveFormsQuery('en', 'CA');
export const CA_scenarios = mapTabScenarios(
  'en',
  'CA',
  CA_scRoot.tabs,
);
export const CA_address =
  CA_scenarios.formConfig.tabConfigs[1].sections[1];

export const GB_scRoot = adaptiveFormsQuery('en', 'GB');
export const GB_scenarios = mapTabScenarios(
  'en',
  'GB',
  GB_scRoot.tabs,
);
export const GB_address =
  GB_scenarios.formConfig.tabConfigs[1].sections[1];

export const IE_scRoot = adaptiveFormsQuery('en', 'IE');
export const IE_scenarios = mapTabScenarios(
  'en',
  'IE',
  IE_scRoot.tabs,
);
export const IE_address =
  IE_scenarios.formConfig.tabConfigs[1].sections[1];

export const AU_scRoot = adaptiveFormsQuery('en', 'AU');
export const AU_scenarios = mapTabScenarios(
  'en',
  'AU',
  AU_scRoot.tabs,
);
export const AU_address =
  AU_scenarios.formConfig.tabConfigs[1].sections[1];
export const AU_personal =
  AU_scenarios.formConfig.tabConfigs[1].sections[0];

export const NZ_scRoot = adaptiveFormsQuery('en', 'NZ');
export const NZ_scenarios = mapTabScenarios(
  'en',
  'NZ',
  NZ_scRoot.tabs,
);
export const NZ_address =
  NZ_scenarios.formConfig.tabConfigs[1].sections[1];

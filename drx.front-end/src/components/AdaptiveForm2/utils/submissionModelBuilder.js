import dateFormat from 'dateformat';
import getPhoneCodes from './../../Shared/PhoneNumberField/getPhoneCodes';

function buildPersonalDataModel(values) {
  const { firstName, middleName, lastName, year, month, day } =
    values;
  const d = new Date(year, month - 1, day);
  const formattedDate = dateFormat(d, 'yyyy-mm-dd');

  const model = {
    modifiedByApp: 'drx',
    account: {
      firstName,
      middleName,
      lastName,
      dateOfBirth: formattedDate,
    },
  };

  return model;
}

// lookup is an array of regions/states, used for data translation on submit
function getStateCodeValue(countryIso2Code, addressState, lookup) {
  let state;
  let region;
  switch (countryIso2Code) {
    case 'GB':
    case 'IE':
    case 'UK':
    case 'PR':
      state = null;
      break;
    case 'JP':
      // do lookup here
      region = lookup.filter(
        region => region.name === addressState,
      )[0];
      // in a jp browser abbr should return a result
      // in a en browser, the lookup wont work as we already have the en value SFHC wants
      state = region?.abbr || addressState.toUpperCase();
      break;
    default:
      state = addressState;
  }
  return state;
}

// lookup is an array of regions/states, used for data translation on submit
function getStateNameValue(countryIso2Code, addressState, lookup) {
  let state;
  let region;
  switch (countryIso2Code) {
    case 'IT':
      // do lookup here
      region = lookup.filter(
        region => region.abbr === addressState,
      )[0];
      state = region?.name || addressState;
      break;

    default:
      state = addressState;
  }
  return state;
}

function buildAddressDataModel(values, lookup) {
  const isAddAddress = values.addressInput ? true : false;

  let countryIso2Code;
  let addressState;
  let stateCodeValue;
  let stateNameValue;
  if (isAddAddress) {
    countryIso2Code =
      values.country || values.addressInput.address?.country;
    addressState = values.addressInput.address?.state;
    stateCodeValue = getStateCodeValue(
      countryIso2Code,
      addressState,
      lookup,
    );
    stateNameValue = getStateNameValue(
      countryIso2Code,
      addressState,
      lookup,
    );
  }

  let model;
  // add new or edit existing address
  model = {
    // used for "change"
    modifiedByApp: 'drx',
    isBilling: values.isBilling || false,
    isShipping: values.isShipping || false,
    isMailing: values.isMailing || false,
    ...(!isAddAddress && {
      addressId: values.addressId, // for existing addresses only
    }),
    // used for "add"
    ...(isAddAddress && {
      street1: values.addressInput.address?.street,
      street2: null,
      street3: null,
      street4: null,
      city: values.addressInput.address?.city,
      state: stateNameValue,
      stateCode: stateCodeValue,
      postalCode: values.addressInput.address?.postcode,
      countryIso2Code,
    }),
  };

  return model;
}

function buildPhoneNumberObject(obj, initialObj) {
  // the array of country objects used to populate the country code list

  const codeObject = getPhoneCodes();
  const code = codeObject.find(o => o.value === obj.country);

  // if sms is false, return Withdrawn if the original value wasnt null
  const ocSms = obj.ocSms
    ? 'Given'
    : initialObj && initialObj?.ocSms !== null
      ? 'Withdrawn'
      : null;

  return {
    type: obj.type,
    phoneNumber: code.label + obj.nationalNumber,
    ocSms,
    isValid: true,
    isPrimary: obj.isPrimary,
    country: obj.country,
    areaCodeAndNumber: obj.nationalNumber,
  };
}

function buildContactDataModel(values) {
  // if sms is false, return Withdrawn if the original value wasnt null

  const model = {
    modifiedByApp: 'drx',
    account: {
      phones: {
        mobile: {
          callingCode: values.mobilePhone?.value?.CallingCode,
          countryCode: values.mobilePhone?.value?.CountryCode,
          number: values.mobilePhone?.value?.Number,
          ocSms: values.mobilePhone?.value?.ocSms
            ? 'Opt-In'
            : 'Opt-Out',
        },
        phone: {
          callingCode: values.homePhone?.value?.CallingCode,
          countryCode: values.homePhone?.value?.CountryCode,
          number: values.homePhone?.value?.Number,
        },
      },
      email: values.contactEmail,
    },
  };

  return model;
}

export default function buildModel(values, modelName, lookup) {
  switch (modelName) {
    case 'personal':
      return buildPersonalDataModel(values);

    case 'addressMaintenance':
    case 'address':
      return buildAddressDataModel(values, lookup);

    case 'contact':
      return buildContactDataModel(values);

    default:
      return values;
  }
}

import dateFormat from 'dateformat';
import getPhoneCodes from '../../Shared/PhoneNumberField/getPhoneCodes';

function buildPersonalDataModel(values) {
  const { firstName, lastName, year, month, day } = values;
  const d = new Date(year, month - 1, day);
  const formattedDate = dateFormat(d, 'yyyy-mm-dd');

  const model = {
    modifiedByApp: 'drx',
    account: {
      firstName,
      lastName,
      dateOfBirth: formattedDate,
    },
  };

  return model;
}

function buildAddressDataModel(values) {
  const model = {
    modifiedByApp: 'drx',
    street1: values.street1,
    street2: values.street2,
    street3: '',
    street4: null,
    city: values.city,
    state: values.state,
    postalCode: values.postcode,
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

function buildContactDataModel(numbers, initialNumbers) {
  // console.log(
  //   '🚀 ~ file: submissionModelBuilder.js:61 ~ buildContactDataModel ~ initialNumbers:',
  //   initialNumbers,
  // );
  // console.log(
  //   '🚀 ~ file: submissionModelBuilder.js:61 ~ buildContactDataModel ~ numbers:',
  //   numbers,
  // );
  const model = {
    modifiedByApp: 'drx',
    account: {
      phones: numbers.map((x, index) =>
        buildPhoneNumberObject(x, initialNumbers[index]),
      ),
    },
  };

  return model;
}

export default function buildModel(values, modelName, initial) {
  switch (modelName) {
    case 'personal':
      return buildPersonalDataModel(values);

    case 'address':
      return buildAddressDataModel(values);

    case 'contact':
      return buildContactDataModel(values.numbers, initial);

    default:
      return values;
  }
}

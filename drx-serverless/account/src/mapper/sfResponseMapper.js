const {DataTransform: convertor} = require('node-json-transform');
const _ = require('lodash');

function sfResponseToAccount({phones, account = {}} = {}) {
  const {
    FirstName: firstName,
    LastName: lastName,
    PersonEmail: email,
    Date_of_Birth__pc: dateOfBirth,
    Marketing_Consent_Cochlear_Family__pc: familyConsent
  } = account;

  return {firstName, lastName, email, dateOfBirth, familyConsent, phones};
}

function sfResponseToIdentity(identity) {
  const {
    FirstName: firstName,
    LastName: lastName,
    CochlearUserName: email,
    CIMUserType: userType
  } = identity;

  return {firstName, lastName, email, userType};
}

function sfResponseToPhones(phones, isOcSmsRequired) {
  var ph = phones.map(({type, phoneNumber, isValid, isPrimary, ocSms}) => {
    return {
      type,
      phoneNumber,
      isValid,
      isPrimary,
      ...(isOcSmsRequired ? {ocSms} : {})
    };
  });

  const uniquePHs = [...new Set(ph.map((item) => item.phoneNumber))];

  var unique = uniquePHs.map((x) => {
    var ls = ph.filter((y) => y.phoneNumber == x);
    if (ls.length > 1 && ls.filter((x) => x.type != null).length > 0) {
      return ls.filter((x) => x.type != null)[0];
    } else {
      return ls[0];
    }
  });

  console.log('unique phone numbers: ', unique);

  return unique;
}

function convertAccount(sfAccount) {
  const map = {
    list: 'accounts',
    item: {
      clinic: 'clinics',
      shippingAddress: 'shippingAddress'
    },
    operate: [
      {
        run: function (value) {
          if (_.isEmpty(value)) {
            return null;
          } else {
            return _.orderBy(value, ['lastModifiedDate'], ['desc'])[0].name;
          }
        },
        on: 'clinic'
      },
      {
        run: function (value) {
          return convertor({list: [value]}, nestedMap).transform()[0];
        },
        on: 'shippingAddress'
      }
    ]
  };
  const nestedMap = {
    list: 'list',
    item: {
      address1: 'street',
      city: 'city',
      state: 'state',
      postcode: 'postalCode',
      country: 'country'
    }
  };
  const input = {accounts: [sfAccount]};
  return convertor(input, map).transform()[0];
}

module.exports = {
  sfResponseToAccount,
  sfResponseToPhones,
  sfResponseToIdentity,
  convertAccount
};

import lodash from 'lodash';

function updatePersonalDataModel(data, values) {
  data.firstName.value = values.account.firstName;
  data.lastName.value = values.account.lastName;
  data.dateOfBirth.value = values.account.dateOfBirth;

  return data;
}

function updateAddressDataModel(data, values) {
  data.city = values.city;
  data.postalCode = values.postalCode;
  data.state = values.state;
  data.street1 = values.street1;
  data.street2 = values.street2;
  data.street3 = values.street3;
  return data;
}

function updateContactDataModel(data, values) {
  data.phones.value = values.account.phones;
  return data;
}

function updateInsuranceDataModel(data, values) {
  data.isPending = true;
  data.isEmpty = false;
  data.isConfirmed = false;
  data.insuranceCompany = values.insuranceCompany;
  data.policyNumber = values.policyNumber;
  data.policyHolderName = values.policyHolderName;
  data.groupNumber = values.groupNumber;
  data.groupName = values.groupName;
  return data;
}

export default function updateModel(data, values, modelName) {
  switch (modelName) {
    case 'personal':
      return updatePersonalDataModel(lodash.cloneDeep(data), values);

    case 'address':
      return updateAddressDataModel(lodash.cloneDeep(data), values);

    case 'phones':
      return updateContactDataModel(lodash.cloneDeep(data), values);

    case 'insurance':
      return updateInsuranceDataModel(lodash.cloneDeep(data), values);

    default:
      return values;
  }
}

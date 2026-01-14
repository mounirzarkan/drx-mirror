import lodash from 'lodash';

function updatePersonalDataModel(data, values) {
  data.firstName.value = values.account.firstName;
  data.middleName.value = values.account.middleName;
  data.lastName.value = values.account.lastName;
  data.dateOfBirth.value = values.account.dateOfBirth;
  return data;
}

function updateAddressDataModel(data, values, addressId) {
  const isAddAddress = values.street1 ? true : false;

  if (isAddAddress) {
    // remove tags on other addresses if they exist and
    // if the newly added address has assigned that tag
    if (values.isBilling) {
      const targetBilling = data?.filter(
        x => x.isBilling === true,
      )[0];
      if (targetBilling) targetBilling.isBilling = false;
    }
    if (values.isShipping) {
      const targetShipping = data?.filter(
        x => x.isShipping === true,
      )[0];
      if (targetShipping) targetShipping.isShipping = false;
    }
    if (values.isMailing) {
      const targetMailing = data?.filter(
        x => x.isMailing === true,
      )[0];
      if (targetMailing) targetMailing.isMailing = false;
    }

    // used for "add"
    data.push({
      countryIso2Code: values.countryIso2Code,
      isBilling: values.isBilling || false,
      isMailing: values.isMailing || false,
      isShipping: values.isShipping || false,
      value: {
        address: {
          city: values.city?.toUpperCase() || '',
          postalCode: values.postalCode,
          street: values.street1?.replace(/\n/g, ', ') || '',
          state: values.state || '',
          stateCode: values.stateCode || '',
          country: values.countryName,
        },
        addressId: addressId,
      },
    });
  } else {
    // used for "change"
    // find matching addressId and update
    const targetAddress = data?.filter(
      x => x.value.addressId === values.addressId,
    )[0];

    // remove tags on other addresses if they exist and
    // if the newly edited address has assigned that tag
    if (values.isBilling) {
      const targetBilling = data?.filter(
        x => x.isBilling === true,
      )[0];
      if (targetBilling) targetBilling.isBilling = false;
      targetAddress.isBilling = true;
    }
    if (values.isShipping) {
      const targetShipping = data?.filter(
        x => x.isShipping === true,
      )[0];
      if (targetShipping) targetShipping.isShipping = false;
      targetAddress.isShipping = true;
    }
    if (values.isMailing) {
      const targetMailing = data?.filter(
        x => x.isMailing === true,
      )[0];
      if (targetMailing) targetMailing.isMailing = false;
      targetAddress.isMailing = true;
    }
  }
  return data;
}

function updateContactDataModel(data, values) {
  data.mobilePhone.value.CallingCode =
    values.account.phones.mobile.callingCode;
  data.mobilePhone.value.CountryCode =
    values.account.phones.mobile.countryCode;
  data.mobilePhone.value.Number = values.account.phones.mobile.number;
  data.mobilePhone.value.ocSms =
    values.account.phones.mobile.ocSms === 'Opt-In' ? true : false;

  data.homePhone.value.CallingCode =
    values.account.phones.phone.callingCode;
  data.homePhone.value.CountryCode =
    values.account.phones.phone.countryCode;
  data.homePhone.value.Number = values.account.phones.phone.number;

  data.contactEmail.value = values.account.email;

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

export default function updateModel(
  data,
  values,
  modelName,
  addressId,
) {
  switch (modelName) {
    case 'personal':
      return updatePersonalDataModel(lodash.cloneDeep(data), values);
    case 'addressMaintenance':
    case 'address':
      return updateAddressDataModel(
        lodash.cloneDeep(data),
        values,
        addressId,
      );
    case 'contact':
      return updateContactDataModel(lodash.cloneDeep(data), values);

    // case 'phones':
    //   return updateContactDataModel(lodash.cloneDeep(data), values);

    case 'insurance':
      return updateInsuranceDataModel(lodash.cloneDeep(data), values);

    default:
      return values;
  }
}

const libphonenumber = require('libphonenumber-js');
const {log, utils, getCountryCodeByIsoNumeric} = require('../util/index');

function sageResponseToAccount(
  sageAccount,
  sageConsent,
  sagePatientOrganisationRelationship,
  userType
) {
  const phones = {};
  let mobileNumber;
  let phoneNumber;

  try {
    mobileNumber =
      sageAccount.mobile && libphonenumber.parsePhoneNumber(sageAccount.mobile);
  } catch (error) {
    log.debug('libphonenumber parsePhoneNumber error', error.message);
  }

  Object.assign(
    phones,
    sageAccount.mobile && {
      mobile: {
        callingCode: mobileNumber ? `+${mobileNumber.countryCallingCode}` : '',
        countryCode: mobileNumber
          ? getCountryCodeByIsoNumeric(
              mobileNumber.countryCallingCode,
              sageAccount.primaryCountryCode
            )
          : null,
        number: mobileNumber ? mobileNumber.nationalNumber : sageAccount.mobile,
        ocSms: sageAccount.primaryCountryCode === 'US' ? sageConsent.status : ''
      }
    }
  );

  try {
    phoneNumber =
      sageAccount.phone && libphonenumber.parsePhoneNumber(sageAccount.phone);
  } catch (error) {
    log.debug('libphonenumber parsePhoneNumber error', error.message);
  }
  Object.assign(
    phones,
    sageAccount.phone && {
      phone: {
        callingCode: phoneNumber ? `+${phoneNumber.countryCallingCode}` : '',
        countryCode: phoneNumber
          ? getCountryCodeByIsoNumeric(
              phoneNumber.countryCallingCode,
              sageAccount.primaryCountryCode
            )
          : null,
        number: phoneNumber ? phoneNumber.nationalNumber : sageAccount.phone
      }
    }
  );

  return {
    firstName: sageAccount.firstName,
    middleName: sageAccount.middleName ?? '',
    lastName: sageAccount.lastName,
    dateOfBirth: sageAccount.dateOfBirth,
    email: sageAccount.email,
    isDeceased: sageAccount.isDeceased,
    personas: utils.calculatePersonas(userType, sageAccount.personas),
    clinic:
      sagePatientOrganisationRelationship.patientOrganisationList[0]
        ?.organisation.name ?? '',
    phones
  };
}

module.exports = {
  sageResponseToAccount
};

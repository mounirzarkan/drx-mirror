import getPhoneCodes from '../../Shared/PhoneNumberField/getPhoneCodes';

export default function getCountryFromNumber(parsed, userCountry) {
  let { country, nationalNumber } = parsed || {};

  // a phone number exists but we dont know what country it belongs to
  // typically this happens to an invalid number
  if (!country && nationalNumber) {
    const intl = parsed.format('INTERNATIONAL');
    const code = intl.split(' ')[0];

    const codeObject = getPhoneCodes();
    // get the country code obj that matches the current users country code
    const userCountryObj = codeObject.find(
      o => o.value === userCountry?.toUpperCase(),
    );

    // compare the code to the users country
    if (userCountryObj?.label === code) {
      // if its a match, default to that as the country for the country code
      country = userCountryObj.value;
    } else {
      // find the first country obj where the code matches a value in the dropdown list
      const findCountryObj = codeObject.find(o => o.label === code);
      country = findCountryObj?.value;
    }
  }
  return country;
}

export function isCallingCodeWithinNumber(callingCode, number) {
  if (callingCode && number) {
    return number.substring(0, callingCode.length) === callingCode;
  }
  return false;
}

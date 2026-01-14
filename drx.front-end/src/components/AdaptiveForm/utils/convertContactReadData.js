import parsePhoneNumber from 'libphonenumber-js';
import getCountryFromNumber, {
  isCallingCodeWithinNumber,
} from './getCountryFromNumber.js';

function convertPhone(phone, parsedPhone, userCountry) {
  let { countryCallingCode, nationalNumber } = parsedPhone || {};

  if (
    isCallingCodeWithinNumber(
      `+${countryCallingCode}`,
      phone?.phoneNumber,
    )
  ) {
    // extract and set country from number or default to userCountry if none is found
    return {
      ...phone,
      ocSms: phone?.ocSms === 'Given',
      countryCallingCode,
      nationalNumber,
      country:
        getCountryFromNumber(parsedPhone, userCountry) || userCountry,
      phoneNumber: parsedPhone?.format('INTERNATIONAL') || '',
    };
  }
  // The country code is not found within the number
  // set country to undefined if there is a phone number else phone number is undefined set country to default userCountry
  return {
    ...phone,
    ocSms: phone?.ocSms === 'Given',
    countryCallingCode: undefined,
    country:
      phone?.phoneNumber && phone?.phoneNumber !== ''
        ? undefined
        : userCountry,
    nationalNumber: phone?.phoneNumber?.replace('+', ''),
    phoneNumber: phone?.phoneNumber,
  };
}
export default function convertContactReadData(data, userCountry) {
  const clonedData = { ...data };

  if (
    clonedData?.phones?.value &&
    clonedData?.phones?.value?.length > 0
  ) {
    clonedData.phones = {
      value: clonedData.phones?.value?.map(phone => {
        if (phone) {
          // parses & formats phone number.
          const parsedPhone = parsePhoneNumber(
            phone?.phoneNumber || '',
            {
              defaultCountry: userCountry,
            },
          );

          const readData = convertPhone(
            phone,
            parsedPhone,
            userCountry,
          );

          // reformats data to be inline with what FormatComposite expects to receive.
          // operation: object property are set to equal a value objects, ie {type:''} to {type:{value:''}}.
          return Object.getOwnPropertyNames(readData).reduce(
            (acc, name) => {
              acc[name] = { value: readData[name] };
              return acc;
            },
            {},
          );
        }
        return phone;
      }),
    };
  } else {
    clonedData.phones = {
      value: [{ country: userCountry, ocSms: null }],
    };
  }
  return clonedData;
}

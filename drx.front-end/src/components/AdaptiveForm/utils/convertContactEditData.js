import parsePhoneNumber from 'libphonenumber-js';
import getCountryFromNumber, {
  isCallingCodeWithinNumber,
} from './getCountryFromNumber.js';

export default function convertContactEditData(data, userCountry) {
  const clonedData = { ...data };
  if (
    clonedData?.phones?.value &&
    clonedData?.phones?.value?.length > 0
  ) {
    clonedData.phones = {
      value: clonedData.phones?.value?.map(phone => {
        if (phone) {
          // parses & formats phone number.
          const parsed = parsePhoneNumber(phone?.phoneNumber || '', {
            defaultCountry: userCountry,
          });
          let { countryCallingCode, nationalNumber } = parsed || {};

          // check if the extracted countryCallingCode is within the start of the phone number
          if (
            isCallingCodeWithinNumber(
              `+${countryCallingCode}`,
              phone?.phoneNumber,
            )
          ) {
            // found - get country from number or default to userCountry

            return {
              ...phone,
              country:
                getCountryFromNumber(parsed, userCountry) ||
                userCountry,
              countryCallingCode,
              nationalNumber,
            };
          } else {
            // not found within - country is undefined, set national number.
            return {
              ...phone,
              countryCallingCode,
              country:
                phone?.phoneNumber && phone?.phoneNumber !== ''
                  ? undefined
                  : userCountry,
              nationalNumber: phone?.phoneNumber?.replace('+', ''),
              phoneNumber: phone?.phoneNumber,
            };
          }
        }
        return phone;
      }),
    };
  } else {
    clonedData.phones = {
      value: [{ country: userCountry, isPrimary: true, ocSms: null }],
    };
  }
  return clonedData;
}

const {getCountryName} = require('../util');

function sageResponseAddressMapper({
  id,
  street,
  city,
  state,
  postalCode,
  country,
  countryCode,
  primaryTypes,
  stateCode
}) {
  const convertedAddress = {
    value: {
      addressId: id,
      address: {
        street,
        city,
        state,
        postalCode,
        stateCode
      },
      isPO: '' // note : won't be needed, check front end
    },
    isBilling: primaryTypes && primaryTypes.includes('Billing') ? true : false,
    isMailing: primaryTypes && primaryTypes.includes('Mailing') ? true : false,
    isShipping:
      primaryTypes && primaryTypes.includes('Shipping') ? true : false,
    countryIso2Code: countryCode,
    countryName: country ?? getCountryName(countryCode)
  };

  return convertedAddress;
}

function sageResponseAddressessMapper({patientAddress}) {
  const convertedAddressess = patientAddress.map((address) =>
    sageResponseAddressMapper(address)
  );

  return convertedAddressess;
}

module.exports = {sageResponseAddressMapper, sageResponseAddressessMapper};

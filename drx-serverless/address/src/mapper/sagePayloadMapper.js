function generatePrimaryTypes(isBilling, isShipping, isMailing) {
  const primaryTypes = [];
  isBilling && primaryTypes.push('Billing');
  isShipping && primaryTypes.push('Shipping');
  isMailing && primaryTypes.push('Mailing');
  if (primaryTypes.length === 0) {
    const error = new Error('Tag should have at least one entry');
    error.statusCode = '409';
    throw error;
  }
  return primaryTypes;
}

function sagePayloadAddressMapper({
  street1,
  street2,
  street3,
  street4,
  countryIso2Code,
  city,
  postalCode,
  isBilling,
  isShipping,
  isMailing,
  stateCode
}) {
  if (!street1 || !countryIso2Code) {
    throw new Error('Parameters street/country code not defined');
  }
  if (street4) {
    throw new Error('Street max length should be 3');
  }
  const primaryTypes = generatePrimaryTypes(isBilling, isShipping, isMailing);
  const convertedAddress = {
    street: [street1],
    countryCode: countryIso2Code
  };
  street2 && convertedAddress.street.push(street2);
  street3 && convertedAddress.street.push(street3);
  city && Object.assign(convertedAddress, {city});
  postalCode && Object.assign(convertedAddress, {postalCode});
  stateCode && Object.assign(convertedAddress, {stateCode});
  primaryTypes.length > 0 && Object.assign(convertedAddress, {primaryTypes});
  return convertedAddress;
}

module.exports = {generatePrimaryTypes, sagePayloadAddressMapper};

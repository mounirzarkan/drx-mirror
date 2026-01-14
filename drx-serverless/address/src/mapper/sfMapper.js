function sfAddressMapper(sfAddress) {
  const convertedAddress = sfAddress.items.map(
    ({
      customerIdentifier,
      addressId,
      street1,
      street2,
      street3,
      street4,
      city,
      state,
      postalCode,
      countryIso2Code
    }) => {
      return {
        customerIdentifier,
        addressId,
        street1,
        street2,
        street3,
        street4,
        city,
        state,
        postalCode,
        countryIso2Code
      };
    }
  );

  return convertedAddress[0];
}

module.exports = {sfAddressMapper};

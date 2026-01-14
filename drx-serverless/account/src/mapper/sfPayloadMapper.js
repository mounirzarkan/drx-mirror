function phonesToSfPayload(phones, isOcSmsRequired) {
  return phones.map(
    ({
      type,
      phoneNumber,
      isValid,
      isPrimary,
      country,
      areaCodeAndNumber,
      ocSms
    }) => {
      const obj = {
        type,
        phoneNumber,
        isValid,
        isPrimary,
        country,
        areaCodeAndNumber,
        ...(isOcSmsRequired ? {ocSms} : {})
      };

      return obj;
    }
  );
}

function accountToSfPayload({
  firstName: FirstName,
  lastName: LastName,
  dateOfBirth: Date_of_Birth__pc,
  phones
}) {
  return {FirstName, LastName, Date_of_Birth__pc, phones};
}

module.exports = {
  phonesToSfPayload,
  accountToSfPayload
};

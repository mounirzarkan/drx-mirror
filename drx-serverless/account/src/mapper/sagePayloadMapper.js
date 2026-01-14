function accountToSagePayload(
  countryCode,
  {firstName, lastName, middleName, dateOfBirth, phones, email}
) {
  const convertedAccount = {};
  firstName && Object.assign(convertedAccount, {firstName});
  lastName && Object.assign(convertedAccount, {lastName});
  dateOfBirth && Object.assign(convertedAccount, {dateOfBirth});
  phones?.phone &&
    Object.assign(convertedAccount, {
      phone: `${phones.phone.callingCode ? '+' + phones.phone.callingCode : ''}${phones.phone.number ?? ''}`
    });
  phones?.mobile &&
    Object.assign(convertedAccount, {
      mobile: `${phones.mobile.callingCode ? '+' + phones.mobile.callingCode : ''}${phones.mobile.number ?? ''}`
    });
  middleName !== null &&
    middleName !== undefined &&
    (countryCode === 'US' || countryCode === 'PR') &&
    Object.assign(convertedAccount, {middleName});
  email != null && Object.assign(convertedAccount, {email});
  return convertedAccount;
}

module.exports = {
  accountToSagePayload
};

function stringCompareIgnoreCase(strOne, strTwo) {
  return (
    strOne &&
    strTwo &&
    strOne?.toLowerCase() === strTwo?.toLowerCase()
  );
}

function isAboveAgeBracket(timeStamp, updateAge) {
  if (timeStamp === undefined || timeStamp === null) {
    return false;
  }
  if (updateAge !== undefined) {
    const today = new Date();
    const todayYear = today.getUTCFullYear();
    const todayMonth = today.getUTCMonth();
    const todayDay = today.getUTCDate();
    const birthday = new Date(timeStamp);
    const birthdayYear = birthday.getUTCFullYear();
    const birthdayMonth = birthday.getUTCMonth();
    const birthdayDay = birthday.getUTCDate();

    if (birthdayYear > todayYear - updateAge) {
      return false;
    }
    if (
      birthdayYear === todayYear - updateAge &&
      birthdayMonth > todayMonth
    ) {
      return false;
    }
    if (
      birthdayYear === todayYear - updateAge &&
      birthdayMonth === todayMonth &&
      birthdayDay > todayDay
    ) {
      return false;
    }
  }
  return true;
}

function targetUserType(userType, userIndex) {
  if (userType?.toLowerCase() === 'carer') {
    return userIndex === 0 ? 'carer' : 'recipient';
  }
  return 'recipient';
}

class UserAboutMe {
  constructor(
    subUserType,
    countryUpdateAge,
    dob,
    isAddressRestricted = false,
    hasCarer = false,
    userIndex,
  ) {
    this.subUserType = subUserType;
    this.updateAge = countryUpdateAge; // 18 | undefined
    this.dob = dob;
    this.isAddressRestricted = isAddressRestricted === true;
    this.hasCarer = hasCarer;
    this.targetTabType = targetUserType(subUserType, userIndex);
  }

  // implement tabType
  isScenarioApplicable(
    userType,
    tabType,
    ageGroup,
    addressRestricted,
    hasCarer,
  ) {
    if (
      this.subUserType &&
      stringCompareIgnoreCase(this.subUserType, userType) &&
      stringCompareIgnoreCase(this.targetTabType, tabType)
    ) {
      if (stringCompareIgnoreCase(this.subUserType, 'Carer')) {
        return this.isAddressRestricted === addressRestricted;
      }
      if (this.hasCarer === hasCarer) {
        const isAboveUpdateAge = isAboveAgeBracket(
          this.dob,
          this.updateAge,
        );

        return (
          (stringCompareIgnoreCase(
            'older than update age',
            ageGroup,
          ) &&
            isAboveUpdateAge) ||
          (stringCompareIgnoreCase(
            'younger than update age',
            ageGroup,
          ) &&
            !isAboveUpdateAge)
        );
      }
    }
    return false;
  }
}
export default UserAboutMe;

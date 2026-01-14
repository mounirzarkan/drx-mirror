const log = require('./logUtil.js');

const secretList = {
  READ_AGE_LIST: [
    {key: 'US', value: '13'},
    {key: 'CA', value: '13'},
    {key: 'PR', value: '13'},
    {key: 'IE', value: '16'},
    {key: 'GB', value: '16'},
    {key: 'NZ', value: '13'},
    {key: 'AU', value: '13'},
    {key: 'IT', value: '16'},
    {key: 'JP', value: '16'},
    {key: 'KR', value: '16'},
    {key: 'FR', value: '16'},
    {key: 'BE', value: '16'},
    {key: 'NL', value: '16'},
    {key: 'KR', value: '16'},
    {key: 'CZ', value: '16'}
  ],
  UPDATE_AGE_LIST: [
    {key: 'US', value: '18'},
    {key: 'CA', value: '18'},
    {key: 'PR', value: '18'},
    {key: 'IE', value: '18'},
    {key: 'GB', value: '18'},
    {key: 'NZ', value: '18'},
    {key: 'AU', value: '18'},
    {key: 'IT', value: '18'},
    {key: 'JP', value: '18'},
    {key: 'KR', value: '18'},
    {key: 'FR', value: '18'},
    {key: 'BE', value: '18'},
    {key: 'NL', value: '18'},
    {key: 'KR', value: '18'},
    {key: 'CZ', value: '18'}
  ],
  APP_ACCESS_LIST: [
    {key: 'US_Recipient_update', value: 'uh,dm,ds,store'},
    {key: 'US_Recipient_ro', value: 'uh,dm'},
    {key: 'US_Carer_update', value: 'uh,dm,store'},
    {key: 'US_Provisional_update', value: 'uh,dm,ds,store'},
    {key: 'US_Provisional_ro', value: 'uh,dm'},
    {key: 'US_Provisional Unknown_update', value: 'uh,dm,ds,store'},
    {key: 'US_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'CA_Recipient_update', value: 'uh,dm,store'},
    {key: 'CA_Recipient_ro', value: 'uh,dm'},
    {key: 'CA_Carer_update', value: 'uh,dm,store'},
    {key: 'CA_Provisional_update', value: 'uh,dm,store'},
    {key: 'CA_Provisional_ro', value: 'uh,dm'},
    {key: 'CA_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'CA_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'PR_Recipient_update', value: 'uh,dm,store'},
    {key: 'PR_Recipient_ro', value: 'uh,dm'},
    {key: 'PR_Carer_update', value: 'uh,dm,store'},
    {key: 'PR_Provisional_update', value: 'uh,dm,store'},
    {key: 'PR_Provisional_ro', value: 'uh,dm'},
    {key: 'PR_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'PR_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'GB_Recipient_update', value: 'uh,dm,store'},
    {key: 'GB_Recipient_ro', value: 'uh,dm'},
    {key: 'GB_Carer_update', value: 'uh,dm,store'},
    {key: 'GB_Provisional_update', value: 'uh,dm,store'},
    {key: 'GB_Provisional_ro', value: 'uh,dm'},
    {key: 'GB_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'GB_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'IE_Recipient_update', value: 'uh,dm,store'},
    {key: 'IE_Recipient_ro', value: 'uh,dm'},
    {key: 'IE_Carer_update', value: 'uh,dm,store'},
    {key: 'IE_Provisional_update', value: 'uh,dm,store'},
    {key: 'IE_Provisional_ro', value: 'uh,dm'},
    {key: 'IE_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'IE_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'IT_Recipient_update', value: 'uh,dm,store'},
    {key: 'IT_Recipient_ro', value: 'uh,dm'},
    {key: 'IT_Carer_update', value: 'uh,dm,store'},
    {key: 'IT_Provisional_update', value: 'uh,dm,store'},
    {key: 'IT_Provisional_ro', value: 'uh,dm'},
    {key: 'IT_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'IT_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'AU_Recipient_update', value: 'uh,dm,store'},
    {key: 'AU_Recipient_ro', value: 'uh,dm'},
    {key: 'AU_Carer_update', value: 'uh,dm,store'},
    {key: 'AU_Provisional_update', value: 'uh,dm,store'},
    {key: 'AU_Provisional_ro', value: 'uh,dm'},
    {key: 'AU_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'AU_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'NZ_Recipient_update', value: 'uh,dm,store'},
    {key: 'NZ_Recipient_ro', value: 'uh,dm'},
    {key: 'NZ_Carer_update', value: 'uh,dm,store'},
    {key: 'NZ_Provisional_update', value: 'uh,dm,store'},
    {key: 'NZ_Provisional_ro', value: 'uh,dm'},
    {key: 'NZ_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'NZ_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'FR_Recipient_update', value: 'uh,dm,store'},
    {key: 'FR_Recipient_ro', value: 'uh,dm'},
    {key: 'FR_Carer_update', value: 'uh,dm,store'},
    {key: 'FR_Provisional_update', value: 'uh,dm,store'},
    {key: 'FR_Provisional_ro', value: 'uh,dm'},
    {key: 'FR_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'FR_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'BE_Recipient_update', value: 'uh,dm,store'},
    {key: 'BE_Recipient_ro', value: 'uh,dm'},
    {key: 'BE_Carer_update', value: 'uh,dm,store'},
    {key: 'BE_Provisional_update', value: 'uh,dm,store'},
    {key: 'BE_Provisional_ro', value: 'uh,dm'},
    {key: 'BE_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'BE_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'NL_Recipient_update', value: 'uh,dm,store'},
    {key: 'NL_Recipient_ro', value: 'uh,dm'},
    {key: 'NL_Carer_update', value: 'uh,dm,store'},
    {key: 'NL_Provisional_update', value: 'uh,dm,store'},
    {key: 'NL_Provisional_ro', value: 'uh,dm'},
    {key: 'NL_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'NL_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'JP_Recipient_update', value: 'uh,dm,store'},
    {key: 'JP_Recipient_ro', value: 'uh,dm'},
    {key: 'JP_Carer_update', value: 'uh,dm,store'},
    {key: 'JP_Provisional_update', value: 'uh,dm,store'},
    {key: 'JP_Provisional_ro', value: 'uh,dm'},
    {key: 'JP_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'JP_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'KR_Recipient_update', value: 'uh,dm,store'},
    {key: 'KR_Recipient_ro', value: 'uh,dm'},
    {key: 'KR_Carer_update', value: 'uh,dm,store'},
    {key: 'KR_Provisional_update', value: 'uh,dm,store'},
    {key: 'KR_Provisional_ro', value: 'uh,dm'},
    {key: 'KR_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'KR_Provisional Unknown_ro', value: 'uh,dm'},
    {key: 'CZ_Recipient_update', value: 'uh,dm,store'},
    {key: 'CZ_Recipient_ro', value: 'uh,dm'},
    {key: 'CZ_Carer_update', value: 'uh,dm,store'},
    {key: 'CZ_Provisional_update', value: 'uh,dm,store'},
    {key: 'CZ_Provisional_ro', value: 'uh,dm'},
    {key: 'CZ_Provisional Unknown_update', value: 'uh,dm,store'},
    {key: 'CZ_Provisional Unknown_ro', value: 'uh,dm'},
    {
      key: 'DE_OnlineSupportProfessional_ro',
      value: 'prof-store'
    },
    {
      key: 'DE_OnlineSupportDistributor_ro',
      value: 'prof-store'
    },
    {
      key: 'DE_RegistrationDistributor_ro',
      value: 'prof-store'
    },
    {key: 'DE_ContentProfessional_ro', value: 'prof-store'},
    {
      key: 'DE_RegistrationProfessional_ro',
      value: 'prof-store'
    }
  ]
};

const searchSecretList = (secretListName, searchString) => {
  log.debug('searchSecretList, secretListName:');
  log.debug(secretListName);

  log.debug('searchSecretList, searchString:');
  log.debug(searchString);

  const keyValuePairs = secretList[secretListName];
  const result = keyValuePairs.find((pair) => pair.key === searchString);
  let returnValue = '';
  if (result) {
    returnValue = result.value;
  }
  return returnValue;
};

// ToDo: can be removed as this is stored in Redis
function calculateAgeBasedAccess(dateOfBirth, userType) {
  log.debug('calculateAgeBasedAccess, dateOfBirth:');
  log.debug(dateOfBirth);

  log.debug('calculateAgeBasedAccess, userType:');
  log.debug(userType);

  let userAccess = '';
  let readAge = 999;
  let updateAge = 999;

  // Calculate user's Age
  const ageInMilliseconds = Date.now() - new Date(dateOfBirth).getTime();
  const userAge = Math.abs(new Date(ageInMilliseconds).getUTCFullYear() - 1970);

  const readAgeResult = searchSecretList('READ_AGE_LIST', countryCode);
  const updateAgeResult = searchSecretList('UPDATE_AGE_LIST', countryCode);

  log.debug('calculateAgeBasedAccess, readAgeResult:');
  log.debug(readAgeResult);

  log.debug('calculateAgeBasedAccess, updateAgeResult:');
  log.debug(updateAgeResult);

  readAge = readAgeResult !== '' ? parseInt(readAgeResult, 10) : 999;
  updateAge = updateAgeResult !== '' ? parseInt(updateAgeResult, 10) : 999;

  log.debug('calculateAgeBasedAccess, readAge:');
  log.debug(readAge);

  log.debug('calculateAgeBasedAccess, updateAge:');
  log.debug(updateAge);

  // Calculate Access ("", "ro" or "update")
  if (userType === 'Carer') {
    userAccess = 'update';
  } else {
    if (userAge >= updateAge) {
      userAccess = 'update';
    } else if (userAge >= readAge) {
      userAccess = 'ro';
    } else {
      userAccess = '';
    }
  }

  log.debug('calculateAgeBasedAccess, userAccess');
  log.debug(userAccess);

  return userAccess;
}

async function calculateAppClaims(payload) {
  log.debug('calculateAppClaims, payload:');
  log.debug(payload);

  try {
    // Get the current users Date Of Birth, Country and User Type
    const {userType, countryCode, userAccess} = payload;

    const appAccessListKey = countryCode + '_' + userType + '_' + userAccess;

    log.debug('calculateAppClaims, appAccessListKey:');
    log.debug(appAccessListKey);

    // Based on the app code built above, find the access string from the Access List secret
    const accessCodeResult = searchSecretList(
      'APP_ACCESS_LIST',
      appAccessListKey
    );
    accessCode = accessCodeResult;

    log.debug('calculateAppClaims, accessCode:');
    log.debug(accessCode);

    return accessCode;
  } catch (error) {
    return accessCode;
  }
}

module.exports = {calculateAgeBasedAccess, calculateAppClaims};

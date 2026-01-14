/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
// utilities and helper functions
import { authenticationService } from '../../../utils/_services';
import config from '../../../config';
import { addValueProperty } from './convertValueProperties';
import { countryCodeToName } from '../../../utils/countryConvert';

const { apiEndpoint } = config;
const accountUrl = `${apiEndpoint}/patients/me`;
const addressUrl = `${apiEndpoint}/patients/me/address`;
const convertPhoneUrl = `${apiEndpoint}/utils/convert-phone`;

// fetch data
// same as orders getData can be refactored.
async function getData(url, currentUser) {
  const response = await axios(url, {
    params: {},
    headers: { Authorization: `Bearer ${currentUser}` },
  });
  // from returned response
  const newToken = response.headers['x-amzn-remapped-authorization'];
  if (newToken) authenticationService.updateCurrentUser(newToken);

  return response && response.data;
}

function mapCarerData(accountResponse) {
  return {
    value:
      Array.isArray(accountResponse?.data?.account?.relatedCarers) &&
      accountResponse?.data?.account?.relatedCarers?.map(
        displayValue => {
          return {
            firstName: {
              value: displayValue.firstName,
            },
            lastName: {
              value: displayValue.lastName,
            },
          };
        },
      ),
  };
}

function convertPhone(phone) {
  const phoneNumberObject = getData(
    `${convertPhoneUrl}/${phone.callingCode}${phone.number}`,
  );
  return phoneNumberObject;
}

function removePlus(callingCode) {
  if (callingCode) {
    return callingCode.charAt(0) !== '+'
      ? callingCode
      : callingCode.substring(1);
  }
  return '';
}

function getUpdatedNumber(original, transformed) {
  return {
    Number: transformed?.nationalNumber || original?.number || '',
    CallingCode:
      transformed?.countryCallingCode ||
      removePlus(original?.callingCode) ||
      '',
    CountryCode: transformed?.country || original?.countryCode || '',
  };
}

// streetArray is expected to be an array of strings
function transformStreet(streetArray) {
  if (Array.isArray(streetArray) && streetArray.length > 0) {
    return streetArray.join(', ');
  } else {
    return '';
  }
}

const useAccountData = (
  user,
  targetUserId,
  currentUser,
  errorCallback,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancel = false;
    const fetchData = async () => {
      setIsLoading(true);

      const accountData = getData(
        `${accountUrl}?id=${targetUserId}`,
        currentUser,
      );
      let addressData = getData(
        `${addressUrl}?id=${targetUserId}`,
        currentUser,
      );

      addressData = addressData.catch(error => {
        // handles 451 response for address.

        if (!cancel && error?.response?.status === 451) {
          return {
            data: { address: { isRestricted: true } },
          };
        }
        throw error;
      });

      await Promise.all([accountData, addressData])
        .then(([accountResponse, addressResponse]) => {
          if (!cancel) {
            const addressResponseData =
              addressResponse?.data?.address;

            const AddressResult = Array.isArray(addressResponseData)
              ? addressResponseData?.map(addr => {
                  let addressValue = {
                    city: addr.value?.address?.city,
                    postalCode: addr.value?.address?.postalCode,
                    state: addr.value?.address?.state,
                    stateCode: addr.value?.address?.stateCode,
                    street: transformStreet(
                      addr.value?.address?.street,
                    ),
                    country: countryCodeToName(addr.countryIso2Code),
                  };
                  let addressMaintenance = {
                    countryIso2Code: addr.countryIso2Code,
                    countryName: countryCodeToName(
                      addr.countryIso2Code,
                    ),
                    isBilling: addr.isBilling,
                    isMailing: addr.isMailing,
                    isShipping: addr.isShipping,
                    value: {
                      address: addressValue,
                      addressId: addr.value?.addressId,
                      isPO: addr.value?.isPO,
                    },
                  };
                  return addressMaintenance;
                })
              : // if it's not an array, it might be returning: { isRestricted: true }
                addressResponseData || [];

            // account api returns a list of user phone numbers
            // we take the home and primary mobile and pass them to the
            // convert phone api

            const phoneList = accountResponse?.data?.account?.phones;
            const mobilePhone = phoneList?.mobile;
            const homePhone = phoneList?.phone;

            let mobilePhoneData =
              mobilePhone && convertPhone(mobilePhone);
            let homePhoneData = homePhone && convertPhone(homePhone);

            let mobilePhoneTransformedData;
            let homePhoneTransformedData;

            // promise inside promise
            Promise.allSettled([mobilePhoneData, homePhoneData])
              .then(results => {
                // Process results after both requests have settled
                results.forEach((result, index) => {
                  if (result.status === 'fulfilled' && result.value) {
                    if (index === 0) {
                      const phoneData = result.value.data;
                      const mobilePhoneTransformed = getUpdatedNumber(
                        mobilePhone,
                        phoneData,
                      );

                      // set mobile
                      mobilePhoneTransformedData = {
                        value: {
                          ...mobilePhoneTransformed,
                          ...(mobilePhone?.ocSms && {
                            ocSms:
                              mobilePhone?.ocSms === 'Opt-In'
                                ? true
                                : false,
                          }),
                        },
                      };
                    }

                    if (index === 1) {
                      const phoneData = result.value.data;
                      const homePhoneTransformed = getUpdatedNumber(
                        homePhone,
                        phoneData,
                      );

                      // set home
                      homePhoneTransformedData = {
                        value: {
                          ...homePhoneTransformed,
                        },
                      };
                    }
                  } else {
                    // phone number api failed
                    if (index === 0) {
                      const mobilePhoneTransformed =
                        getUpdatedNumber(mobilePhone);

                      // set mobile
                      mobilePhoneTransformedData = {
                        value: {
                          ...mobilePhoneTransformed,
                          ...(mobilePhone?.ocSms && {
                            ocSms:
                              mobilePhone?.ocSms === 'Opt-In'
                                ? true
                                : false,
                          }),
                        },
                      };
                    }

                    if (index === 1) {
                      const homePhoneTransformed =
                        getUpdatedNumber(homePhone);

                      // set home
                      homePhoneTransformedData = {
                        value: {
                          ...homePhoneTransformed,
                        },
                      };
                    }
                  }
                });
              })
              .catch(error => {
                // This will not be called, as Promise.allSettled does not reject
                // continue even though it failed, we will just use the data as is.
              })
              .finally(() => {
                if (!cancel) {
                  const data = {
                    personal: {
                      ...addValueProperty(
                        accountResponse?.data?.account,
                      ),
                    },
                    addressMaintenance: AddressResult,
                    contact: {
                      mobilePhone: mobilePhoneTransformedData,
                      homePhone: homePhoneTransformedData,
                      contactEmail: {
                        value:
                          accountResponse?.data?.account.email || '',
                      },
                    },
                    carers: {
                      names: mapCarerData(accountResponse),
                    },
                  };
                  setData(data);
                  setIsLoading(false);
                }
              });
          }
        })
        .catch(error => {
          const { response } = error;
          errorCallback(response?.status);
          setIsLoading(false);
        });
    };

    if (targetUserId !== undefined) {
      fetchData();
    }
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line
  }, [user]);

  return [isLoading, data, setData, setIsLoading];
};

export default useAccountData;

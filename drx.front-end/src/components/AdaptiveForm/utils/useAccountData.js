/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import axios from 'axios';
// utilities and helper functions
import config from '../../../config';
import { authenticationService } from '../../../utils/_services';
import { countryCodeToName } from '../../../utils/countryConvert';
import { addValueProperty } from './convertValueProperties';

const { apiEndpoint } = config;
const accountUrl = `${apiEndpoint}/patients/me`;
const addressUrl = `${apiEndpoint}/patients/me/address`;

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
        displayValue => ({
          type: 'default',
          displayValue,
        }),
      ),
  };
}

const useAccountData = (
  user,
  targetUserId,
  currentUser,
  errorCallback,
  userListConfig,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

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
            setData({
              personal: addValueProperty(
                accountResponse?.data?.account,
              ),
              address: {
                ...(addressResponse?.data?.address || {}),
                countryName: countryCodeToName(
                  addressResponse?.data?.address?.countryIso2Code,
                ),
              },
              phones: addValueProperty(
                accountResponse?.data?.account,
              ),
              carers: {
                phones: mapCarerData(accountResponse),
              },
            });
            setIsLoading(false);
          }
        })
        .catch(error => {
          const { response } = error;
          if (!cancel) {
            cancel = true;
            errorCallback(response?.status);
            setIsLoading(false);
          }
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

import { useEffect } from 'react';
import useHttpRequest from './useHttpRequest';
import config from '../config';

const mockMode = process.env.REACT_APP_TEST_VAR === 'LOCAL';
const mockUrl =
  'https://d5bf7f38-2409-4725-8047-bf046bb23f08.mock.pstmn.io';
// 'http://127.0.0.1:4523/m1/3315209-0-default';
const { apiEndpoint } = config;
const accountUrl = !mockMode
  ? `${apiEndpoint}/patients/me`
  : `${mockUrl}/patients/me`;

function getUserList(userListConfig, labels, response) {
  // get text based on user type (case-insensitive)
  const getUserType = (personas, labels) => {
    // normalize personas to lowercase
    const lowerPersonas = (personas ?? []).map(p => p.toLowerCase());

    if (
      lowerPersonas.includes('carer') &&
      lowerPersonas.includes('recipient')
    ) {
      return labels['drx.labels.personas.carerPatient'];
    }

    return labels['drx.labels.personas.carer'];
  };

  const { includeCarer, userType, sub } = userListConfig;
  const {
    firstName,
    lastName,
    relatedRecipients: recipientList,
    personas,
  } = response?.data?.data?.account || {};

  const orderByFirstName =
    recipientList?.length > 0 &&
    recipientList.sort((a, b) =>
      a.firstName.localeCompare(b.firstName),
    );

  const recipientListSorted = orderByFirstName || [];
  const userList = [];

  // add information to user list if user is a recipient or we are including carer information.
  let tabIndex = 0;
  if (userType.toLowerCase() !== 'carer' || includeCarer) {
    userList.push({
      firstName,
      lastName,
      tabIndex,
      type: personas
        ? getUserType(personas, labels)
        : labels['drx.labels.personas.carer'],
      userId: sub,
    });
    tabIndex += 1;
  }

  // if the user is a carer, push recipient data to the user listData
  if (recipientListSorted.length > 0) {
    recipientListSorted.forEach(recipient => {
      userList.push({
        firstName: recipient.firstName,
        lastName: recipient.lastName,
        tabIndex,
        type: labels['drx.labels.personas.patient'],
        userId: recipient.CochlearId || recipient.cochlearId, // og version had 'CochlearId', so in order to continue to support that, i have kept it in
      });
      tabIndex += 1;
    });
  }
  return userList;
}

export default function useUserList(
  userRequest,
  userListConfig,
  labels,
  onError = null,
) {
  const { isLoading, error, data, send, setData } = useHttpRequest(
    // set initial loading to false if userRequest is null.
    !!userRequest,
  );
  useEffect(() => {
    if (userRequest) {
      // send request when userRequest obj is truthy
      send(
        {
          renewAuthCountryCode: userListConfig.countryCode,
          remapAuthorization: !mockMode ? true : false,
          url: `${accountUrl}?id=${userRequest.targetUserId}`,
          headers: {
            Authorization: `Bearer ${userRequest.currentUser}`,
          },
          method: 'GET',
        },
        // transform successful response

        getUserList.bind(
          undefined,
          userListConfig,
          labels,
          //   , {
          //   data: {
          //     firstName: 'Carer1CeliaMcGowanUS',
          //     lastName: 'Carer1CeliaMcGowanUS',
          //     relatedRecipients: JSON.parse(
          //       '[{"firstName":"Celiass","lastName":"McGowan","CochlearId":"9804dcb56dc44e5c6907fe2096f6d5ac3a3e2a9bbb6bffd530d2f81abcc59aa7fHf50UQ%2FlY2VJ3qUM%2BLLJw%3D%3D7aad34e1db8c71754446be537ff1d5bcfa66c0d9da5df364d63296293d3a5569"}]',
          //     ),
          //   },
          // }
        ),
        // transform error reponse
        onError ||
          (err => {
            const { response } = err;
            return response?.status;
          }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRequest]);

  return { isLoading, error, data, setData };
}
export { getUserList };

import { authenticationService } from '../../utils/_services';

export const getData = async (url, currentUser) => {
  const response = await axios(url, {
    params: {},
    headers: { Authorization: `Bearer ${currentUser}` },
  });

  const newToken = response.headers['x-amzn-remapped-authorization'];
  if (newToken) updateUserToken(newToken);

  return response && response.data;
};

function updateUserToken(token) {
    authenticationService.updateCurrentUser(token);
  }
  

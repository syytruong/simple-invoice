import axios from 'axios';
import { API } from '../constants';

export const fetchAccessToken = async (
  username: string,
  password: string
): Promise<{ access_token: string; refresh_token: string }> => {
  try {
    const response = await axios({
      url: `${API.url}/token`,
      method: 'POST',
      params: {
        client_id: API.client_id,
        client_secret: API.client_secret,
        grant_type: API.grant_type,
        scope: API.scope,
        username,
        password,
      },
    });

    const { access_token, refresh_token } = response.data;
    return { access_token, refresh_token };
  } catch (error) {
    throw new Error('Error fetching access token:' + error);
  }
};

export const fetchOrgToken = async (access_token: string): Promise<string> => {
  try {
    const response = await axios({
      url: `${API.url}/membership-service/1.2.0/users/me`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + access_token},
    });

    const { data } = response.data;
  
    return data.memberships[0].token;
  } catch (error) {
    throw new Error("Error fetching org token: " + error);
  }
}

export default {
  fetchAccessToken,
  fetchOrgToken
};
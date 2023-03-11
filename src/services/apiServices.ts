import axios from 'axios';
import { API } from '../constants';
import { Invoice, FetchInvoicesQueryParams } from '../pages/Invoice/interfaces';

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
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data.data.memberships[0].token;
  } catch (error) {
    throw new Error('Error fetching org token: ' + error);
  }
}

export const fetchInvoices = async (
  access_token: string | null,
  org_token: string | null,
  queryParams: FetchInvoicesQueryParams,
): Promise<Invoice[]> => {
  try {
    if (!access_token || !org_token) {
      throw new Error('Credentals are not provided');
    }
    const response = await axios({
      url: `${API.url}/invoice-service/1.0.0/invoices`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'org-token': org_token,
      },
      params: queryParams,
    });

    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching invoices: ' + error);
  }
};

export default {
  fetchAccessToken,
  fetchOrgToken,
  fetchInvoices,
};
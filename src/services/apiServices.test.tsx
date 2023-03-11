import { API } from '../constants';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchAccessToken, fetchOrgToken, fetchInvoices } from './apiServices';

jest.mock('axios');
const mock = new MockAdapter(axios);

describe('fetchAccessToken', () => {
  afterEach(() => {
    mock.reset();
  });

  it('fetches access token successfully', async () => {
    const testUsername = "dung+octopus4@101digital.io";
    const testPassword = 'Abc@123456';
    const testAccessToken = 'testaccesstoken';
    const testRefreshToken = 'testrefreshtoken';

    const data = { access_token: testAccessToken, refresh_token: testRefreshToken };
    mock.onPost(`${API.url}/token`).reply(200, data);

    try {
      const response = await fetchAccessToken(testUsername, testPassword);
      expect(response).toEqual(data);
    } catch (error) {
      console.log('Error:', error);
    }
  });

  it('throws an error if access token cannot be fetched', async () => {
    const testUsername = 'testuser';
    const testPassword = 'testpass';
    const testError = new Error('Error to fetch access token');

    const axiosPostSpy = jest.spyOn(axios, 'post').mockRejectedValueOnce(testError);
    const data = { data: {access_token: '', refresh_token: ''} };
    mock.onPost(`${API.url}/token`).reply(500, data);

    await expect(fetchAccessToken(testUsername, testPassword)).rejects.toThrow('Error fetching access token');

    axiosPostSpy.mockRestore();
  });
});

describe('fetchOrgToken', () => {
  afterEach(() => {
    mock.reset();
  });

  const testAccessToken = 'testAccessToken';
  const testOrgToken = 'testOrgToken';

  it('returns the organization token if the API call succeeds', async () => {
    mock.onGet(`${API.url}/membership-service/1.2.0/users/me`).reply(200, {
      data: {
        memberships: [{ token: testOrgToken }]
      }
    });

    try {
      const response = await fetchOrgToken(testAccessToken);
      expect(response).toEqual(testOrgToken); 
    } catch (error) {
      console.log('Error:', error);
    }
   
  });

  it('throws an error if the API call fails', async () => {
    const testError = new Error('Error fetching org token');
    const mock = new MockAdapter(axios);
    mock.onGet(`${API.url}/membership-service/1.2.0/users/me`).reply(500, testError);

    await expect(fetchOrgToken(testAccessToken)).rejects.toThrowError('Error fetching org token');
  });
});

describe('fetchInvoices', () => {
  afterEach(() => {
    mock.reset();
  });

  const queryParams = {
    pageSize: 10,
    pageNum: 1,
    ordering: 'desc',
    dateType: 'created',
    sortBy: 'created_at',
    status: 'paid',
  };
  const access_token = 'test_access_token';
  const org_token = 'test_org_token';

  it('fetches invoices successfully', async () => {
    const invoices = [
      {
        id: '1',
        amount: 100,
        date: '2022-01-01',
        status: 'paid',
      },
      {
        id: '2',
        amount: 200,
        date: '2022-01-02',
        status: 'unpaid',
      },
    ];
    mock
      .onGet(`${API.url}/invoice-service/1.0.0/invoices`, {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${access_token}`,
          'org-token': org_token,
        },
      })
      .reply(200, { data: invoices });

    fetchInvoices(access_token, org_token, queryParams).then(response => {
      expect(response).toEqual(invoices);
    })
  });

  it('throws an error if credentials are not provided', async () => {
    const access_token = null;
    const org_token = null;
    const expectedError = 'Credentals are not provided';

    mock
      .onGet(`${API.url}/invoice-service/1.0.0/invoices`, {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${access_token}`,
          'org-token': org_token,
        },
      })
      .reply(400, expectedError);

    await expect(fetchInvoices(access_token, org_token, queryParams)).rejects.toThrow(expectedError);
  });

  it('throws an error if there is an error fetching invoices', async () => {
    const expectedError = 'Error fetching invoices';

    mock
      .onGet(`${API.url}/invoice-service/1.0.0/invoices`, {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${access_token}`,
          'org-token': org_token,
        },
      })
      .reply(500, expectedError);

    await expect(fetchInvoices(access_token, org_token, queryParams)).rejects.toThrow(expectedError);
  });
});
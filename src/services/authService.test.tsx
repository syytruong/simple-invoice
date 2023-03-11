import { API } from '../constants';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchAccessToken, fetchOrgToken } from './authService';

jest.mock('axios');

describe('fetchAccessToken', () => {
  // const testUsername = 'dung+octopus4@101digital.io';
  // const testPassword = 'Abc@123456';
  const testUsername = 'testuser';
  const testPassword = 'testpass';

  it('fetches access token successfully', async () => {
    const testUsername = 'dung+octopus4@101digital.io';
    const testPassword = 'Abc@123456';
    const testAccessToken = 'testaccesstoken';
    const testRefreshToken = 'testrefreshtoken';

    const mock = new MockAdapter(axios);
    const data = { access_token: testAccessToken, refresh_token: testRefreshToken };
    mock.onPost(`${API.url}/token`).reply(200, data);

    fetchAccessToken(testUsername, testPassword).then(response => {
      expect(response).toEqual(data); 
    })

    mock.reset();
  });

  it('throws an error if access token cannot be fetched', async () => {
    const testError = new Error('Failed to fetch access token');

    const axiosPostSpy = jest.spyOn(axios, 'post').mockRejectedValueOnce(testError);

    const mock = new MockAdapter(axios);
    const data = { data: {access_token: '', refresh_token: ''} };
    mock.onPost(`${API.url}/token`).reply(500, data);

    await expect(fetchAccessToken(testUsername, testPassword)).rejects.toThrow('Error fetching access token');

    axiosPostSpy.mockRestore();
  });
});

describe('fetchOrgToken', () => {
  const testAccessToken = 'testAccessToken';
  const testOrgToken = 'testOrgToken';

  it('returns the organization token if the API call succeeds', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${API.url}/membership-service/1.2.0/users/me`).reply(200, {
      data: {
        memberships: [{ token: testOrgToken }]
      }
    });

    fetchOrgToken(testAccessToken).then((result) => {
      expect(result).toEqual(testOrgToken);
    })

    mock.reset();
  });

  it('throws an error if the API call fails', async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(`${API.url}/membership-service/1.2.0/users/me`).reply(500);

    await expect(fetchOrgToken(testAccessToken)).rejects.toThrowError('Error fetching org token:');

    mock.reset();
  });
});
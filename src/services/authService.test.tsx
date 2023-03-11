import { API } from '../constants';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchAccessToken } from './authService';

jest.mock('axios');

describe('fetchAccessToken', () => {
  it('fetches access token successfully', async () => {
    const testUsername = 'dung+octopus4@101digital.io';
    const testPassword = 'Abc@123456';
    const testAccessToken = 'testaccesstoken';
    const testRefreshToken = 'testrefreshtoken';

    const mock = new MockAdapter(axios);
    const data = { data: {access_token: testAccessToken, refresh_token: testRefreshToken} };
    mock.onPost(`${API.url}/token`).reply(200, data);

    fetchAccessToken(testUsername, testPassword).then(response => {
      console.log(response);
      expect(response).toEqual(data); 
    });
  });

  it('throws an error if access token cannot be fetched', async () => {
    const testUsername = 'testuser';
    const testPassword = 'testpass';
    const testError = new Error('Failed to fetch access token');

    const axiosPostSpy = jest.spyOn(axios, 'post').mockRejectedValueOnce(testError);

    const mock = new MockAdapter(axios);
    const data = { data: {access_token: '', refresh_token: ''} };
    mock.onPost(`${API.url}/token`).reply(500, data);

    await expect(fetchAccessToken(testUsername, testPassword)).rejects.toThrow('Error fetching access token');

    axiosPostSpy.mockRestore();
  });
});

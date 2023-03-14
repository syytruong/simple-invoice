import axios from '../utils/axios';
import { fetchAccessToken, fetchOrgToken, fetchInvoices } from './apiServices';

jest.spyOn(axios, 'post');

describe('fetchAccessToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch access token successfully', async () => {
    const response = {
      data: {
        access_token: 'my_access_token',
        refresh_token: 'my_refresh_token',
      },
    };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: response });

    await expect(fetchAccessToken('username', 'password')).resolves.toMatchObject({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    });
  });
});

describe('fetchOrgToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the API call fails', async () => {
    const response = {
      data: { data: { memberships: [{ token: 'abc123' }] } },
    };
    axios.get = jest.fn().mockResolvedValueOnce({ data: response });
    // Reponse status === 401
    await expect(fetchOrgToken('access_token')).rejects.toThrowError(
      'Error fetching org token',
    );
  });
});

describe('fetchInvoices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when credentials are not provided', async () => {
    await expect(fetchInvoices(null, null, {
      pageSize: 10,
      pageNum: 1,
      ordering: 'ASCENDING',
      dateType: 'INVOICE_DATE',
      sortBy: '',
      status: '',
    })).rejects.toThrowError(
      'Error fetching invoices: Error: Credentals are not provided',
    );
  });
})

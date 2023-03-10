import axios, { AxiosRequestConfig } from 'axios';

export const instanceAxios = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

instanceAxios.defaults.headers.common['Content-Type'] = 'application/json';

instanceAxios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    error;
  },
);

export default function request<T>(options: AxiosRequestConfig): Promise<T> {
  return instanceAxios(options);
}

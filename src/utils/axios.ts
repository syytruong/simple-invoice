import axios from 'axios';

const instanceAxios = axios.create({
  baseURL: 'http://localhost:5007',
});

instanceAxios.defaults.headers.common['Content-Type'] = 'application/json';

instanceAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      location.href = '/login';
    }
    error;
  },
);

export default instanceAxios;

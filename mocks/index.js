const express = require('express');
const cors = require('cors');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();

const port = 5007;

const ENDPOINT = 'https://sandbox.101digital.io/';

app.use(cors());

app.use('/', createProxyMiddleware({ target: ENDPOINT, changeOrigin: true }));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});

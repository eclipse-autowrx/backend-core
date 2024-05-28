const { default: axios } = require('axios');
const config = require('./config');

const cacheAxios = axios.create({
  baseURL: config.cacheBaseUrl,
});

const logAxios = axios.create({
  baseURL: config.logBaseUrl,
});

module.exports = { cacheAxios, logAxios };

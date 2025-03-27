const { default: axios } = require('axios');
const config = require('./config');

const logAxios = axios.create({
  baseURL: config.services.log.url,
});

module.exports = { logAxios };

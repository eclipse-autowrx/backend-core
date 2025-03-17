const moment = require('moment');
const axios = require('axios');
const config = require('../config/config');

let authorizationData = {
  accessToken: null,
  createdAt: null,
  expiresIn: null,
};

/**
 *
 * @returns {Promise<{
 * accessToken: string
 * createdAt: Date
 * expiresIn: number}>}
 */
const getAuthorizationData = async () => {
  const token = authorizationData.accessToken;
  if (!token || moment().diff(authorizationData.createdAt, 'seconds') >= authorizationData.expiresIn) {
    const newAuthorizationData = await getAccessToken();
    setAuthorizationData({
      ...newAuthorizationData,
      createdAt: new Date(),
    });
  }
  return authorizationData;
};

const getAccessToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', config.etas.clientId || '');
  params.append('client_secret', config.etas.clientSecret || '');
  params.append('scope', config.etas.scope || '');

  // console.log('ETAS_CLIENT_ID', config.etas.clientId);
  // console.log('ETAS_CLIENT_SECRET', config.etas.clientSecret);
  // console.log('ETAS_SCOPE', config.etas.scope);

  try {
    const response = await axios.post(
      'https://p2.authz.bosch.com/auth/realms/EU_CALPONIA/protocol/openid-connect/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    };
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to fetch token');
  }
};

/**
 *
 * @param {{
 * accessToken: string
 * createdAt: Date
 * expiresIn: number
 * }} data
 */
const setAuthorizationData = (data) => {
  authorizationData = data;
};

module.exports = {
  getAuthorizationData,
  setAuthorizationData,
};

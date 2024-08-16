const { isAxiosError, default: axios } = require('axios');
const logger = require('../config/logger');
const { getAuthorizationData, setAuthorizationData } = require('../states/certivityAuthorization');
const config = require('../config/config');
const moment = require('moment');

/**
 *
 * @returns {Promise<{access_token: string, expires_in: number} | null>}
 */
const retrieveCredentials = async () => {
  try {
    const response = await axios.post(config.certivity.authBaseUrl, {
      client_id: config.certivity.clientId,
      client_secret: config.certivity.clientSecret,
      audience: config.certivity.authAudience,
      grant_type: config.certivity.authGrantType,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logger.error(
        `Axios error. Error retrieving credentials from Certivity using axios: ${
          error.response.data?.message || error.message
        }`
      );
    } else {
      logger.error(`Error retrieving credentials from Certivity: ${error.message}`);
    }
    return null;
  }
};

/**
 *
 * @returns {Promise<{access_token: string} | null>}
 */
const getCredentials = async () => {
  let { access_token, expires_at } = getAuthorizationData();

  // Check if the token is expired or not set
  if (!access_token || moment(expires_at).isBefore(moment())) {
    const newCredentials = await retrieveCredentials();
    if (!newCredentials) {
      return null;
    }
    setAuthorizationData({
      access_token: newCredentials.access_token,
      // Subtract 5 seconds to ensure the token is not expired when calling the Certivity API
      expires_at: moment()
        .add(newCredentials.expires_in - 5, 'seconds')
        .toDate(),
    });
    access_token = newCredentials.access_token;
  }

  return {
    access_token,
  };
};

/**
 *
 * @param {string} accessToken
 * @param {string} vehicleApis
 * @returns {Promise<*>}
 */
const getRegulations = async (accessToken, vehicleApis) => {
  try {
    const response = await axios.get(config.certivity.regulationBaseUrl, {
      headers: {
        Authorization: accessToken,
      },
      params: {
        vehicleApis,
      },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logger.error(
        `Axios error. Error querying vehicle apis regulation using axios: ${error.response.data?.message || error.message}`
      );
    } else {
      logger.error(`Error querying vehicle apis regulation: ${error.message}`);
    }
    return null;
  }
};

module.exports = {
  getCredentials,
  getRegulations,
};

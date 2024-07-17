let authorizationData = {
  accessToken: null,
  expiresIn: null,
};

/**
 *
 * @returns {{
 * accessToken: string
 * expiresIn: number}}
 */
const getAuthorizationData = () => {
  return authorizationData;
};

/**
 *
 * @param {{
 * accessToken: string
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

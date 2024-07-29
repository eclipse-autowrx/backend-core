let authorizationData = {
  accessToken: null,
  createdAt: null,
  expiresIn: null,
};

/**
 *
 * @returns {{
 * accessToken: string
 * createdAt: Date
 * expiresIn: number}}
 */
const getAuthorizationData = () => {
  return authorizationData;
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

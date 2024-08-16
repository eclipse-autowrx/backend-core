/**
 * @typedef {{
 * access_token: string | null;
 * expires_at: Date | null}} AuthorizationData
 */
let authorizationData = {
  access_token: null,
  expires_at: null,
};

/**
 *
 * @returns {AuthorizationData}
 */
const getAuthorizationData = () => {
  return authorizationData;
};

/**
 *
 * @param {AuthorizationData} data
 */
const setAuthorizationData = (data) => {
  authorizationData = data;
};

module.exports = {
  getAuthorizationData,
  setAuthorizationData,
};

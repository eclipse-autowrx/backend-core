const { userService } = require('.');
const config = require('../config/config');

/**
 *
 * @param {string} userId
 * @param {{
 *  role: 'model_contributor' | 'model_member',
 *  id: string,
 * }} condition
 * @returns {Promise<boolean>}
 */
const check = async (userId, condition) => {
  const user = await userService.getUserById(userId);
  return user.roles[condition.role].includes(condition.id);
};

/**
 *
 * @param {{
 *  role: 'model_contributor' | 'model_member',
 *  id: string,
 * }} condition
 * @returns {Promise<import('../models/user.model').User>}
 */
const listAuthorizedUser = async (condition) => {
  const response = await userService.queryUsers(
    {
      roles: {
        [condition.role]: condition.id,
      },
    },
    {
      limit: config.constraints.model.maximumAuthorizedUsers,
    }
  );
  return response.results;
};

module.exports = {
  check,
  listAuthorizedUser,
};

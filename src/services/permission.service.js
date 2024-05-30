const { userService } = require('.');

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

module.exports = {
  check,
};

const ChangeLog = require('../models/changeLog.model');

/**
 *
 * @param {Object} filter
 * @param {Object} options
 * @param {string} options.sortBy - Sort option in the format: sortField:(desc|asc)
 * @param {number} options.limit - Maximum number of results per page (default = 10)
 * @param {number} options.page - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const listChangeLogs = async (filter, options) => {
  return ChangeLog.paginate(filter, options);
};

module.exports.listChangeLogs = listChangeLogs;

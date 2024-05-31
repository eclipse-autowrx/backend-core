const Discussion = require('../models/discussion.model');

/**
 *
 * @param {Object} discussionBody
 * @returns {Promise<Discussion.Discussion>}
 */
const createDiscussion = async (discussionBody) => {
  const discussion = await Discussion.create(discussionBody);
  return discussion;
};

/**
 *
 * @param {Object} filter
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {fields} [options.fields] - Fields to select
 * @returns {Promise<QueryResult>}
 */
const queryDiscussions = async (filter, options) => {
  const discussions = await Discussion.paginate(filter, options);
  return discussions;
};

/**
 *
 * @param {Object} filter
 * @returns {Promise<Discussion.Discussion[]>}
 */
const listDiscussions = async (filter) => {
  const discussions = await Discussion.find(filter);
  return discussions;
};

module.exports = {
  createDiscussion,
  queryDiscussions,
  listDiscussions,
};

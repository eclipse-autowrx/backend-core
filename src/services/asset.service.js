const Asset = require('../models/asset.model');

/**
 *
 * @param {object} data
 * @returns {Promise<import('../models/asset.model').Asset>}
 */
const createAsset = (data) => {
  return Asset.create(data);
};

/**
 *
 * @param {object} filter
 * @param {object} options
 * @param {string} options.sortBy
 * @param {number} options.limit
 * @param {number} options.page
 */
const queryAssets = (filter, options) => {
  return Asset.paginate(filter, options);
};

module.exports = {
  createAsset,
  queryAssets,
};

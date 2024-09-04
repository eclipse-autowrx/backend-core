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
  if (filter.name) {
    filter.name = new RegExp(filter.name, 'i');
  }
  if (filter.type) {
    filter.type = new RegExp(filter.type, 'i');
  }
  return Asset.paginate(filter, options);
};

/**
 *
 * @param {string} assetId
 */
const getAssetById = (assetId) => {
  return Asset.findById(assetId);
};

/**
 *
 * @param {string} assetId
 * @param {{
 * name?:string
 * type?:string
 * data?:any}} assetBody
 */
const updateAsset = (assetId, assetBody) => {
  return Asset.findOneAndUpdate(
    {
      _id: assetId,
    },
    assetBody
  );
};

const deleteAsset = (assetId) => {
  return Asset.findOneAndDelete({
    _id: assetId,
  });
};

module.exports = {
  createAsset,
  queryAssets,
  updateAsset,
  getAssetById,
  deleteAsset,
};

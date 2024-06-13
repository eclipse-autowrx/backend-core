const httpStatus = require('http-status');
const { ExtendedApi } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a new ExtendedApi
 * @param {Object} extendedApiBody
 * @returns {Promise<ExtendedApi>}
 */
const createExtendedApi = async (extendedApiBody) => {
  return ExtendedApi.create(extendedApiBody);
};

/**
 * Query for ExtendedApis
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExtendedApis = async (filter, options) => {
  const extendedApis = await ExtendedApi.paginate(filter, options);
  return extendedApis;
};

/**
 * Get ExtendedApi by id
 * @param {ObjectId} id
 * @returns {Promise<ExtendedApi>}
 */
const getExtendedApiById = async (id) => {
  return ExtendedApi.findById(id);
};

/**
 * Update ExtendedApi by id
 * @param {ObjectId} extendedApiId
 * @param {Object} updateBody
 * @returns {Promise<ExtendedApi>}
 */
const updateExtendedApiById = async (extendedApiId, updateBody) => {
  const extendedApi = await getExtendedApiById(extendedApiId);
  if (!extendedApi) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtendedApi not found');
  }
  Object.assign(extendedApi, updateBody);
  await extendedApi.save();
  return extendedApi;
};

/**
 * Delete ExtendedApi by id
 * @param {ObjectId} extendedApiId
 * @returns {Promise<ExtendedApi>}
 */
const deleteExtendedApiById = async (extendedApiId) => {
  const extendedApi = await getExtendedApiById(extendedApiId);
  if (!extendedApi) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtendedApi not found');
  }
  await extendedApi.remove();
  return extendedApi;
};

const getExtendedApiByApiNameAndModel = async (apiName, model) => {
  return ExtendedApi.findOne({ apiName, model });
};

module.exports = {
  createExtendedApi,
  queryExtendedApis,
  getExtendedApiById,
  updateExtendedApiById,
  deleteExtendedApiById,
  getExtendedApiByApiNameAndModel,
};

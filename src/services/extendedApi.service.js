const httpStatus = require('http-status');
const { ExtendedApi } = require('../models');
const ApiError = require('../utils/ApiError');
const { permissionService } = require('.');
const { PERMISSIONS } = require('../config/roles');

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
 * @param {string} userId
 * @returns {Promise<ExtendedApi>}
 */
const updateExtendedApiById = async (extendedApiId, updateBody, userId) => {
  const extendedApi = await getExtendedApiById(extendedApiId);
  if (!extendedApi) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtendedApi not found');
  }
  if (!(await permissionService.hasPermission(userId, PERMISSIONS.WRITE_MODEL, extendedApi.model))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden. You do not have permission to update extended API for this model');
  }
  Object.assign(extendedApi, updateBody);
  await extendedApi.save();
  return extendedApi;
};

/**
 * Delete ExtendedApi by id
 * @param {ObjectId} extendedApiId
 * @param {string} userId
 * @returns {Promise<ExtendedApi>}
 */
const deleteExtendedApiById = async (extendedApiId, userId) => {
  const extendedApi = await getExtendedApiById(extendedApiId);
  if (!extendedApi) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtendedApi not found');
  }
  if (!(await permissionService.hasPermission(userId, PERMISSIONS.WRITE_MODEL, extendedApi.model))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden. You do not have permission to update extended API for this model');
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

const httpStatus = require('http-status');
const { userService } = require('.');
const { Api } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 *
 * @param {Object} apiBody
 * @returns {Promise<string>}
 */
const createApi = async (apiBody) => {
  const api = await Api.create(apiBody);
  return api._id;
};

/**
 *
 * @param {string} apiId
 * @returns {Promise<import('../models/api.model').Api>}
 */
const getApi = async (apiId) => {
  const api = await Api.findById(apiId);
  if (!api) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Api not found');
  }
  return api;
};

/**
 *
 * @param {string} modelId
 * @returns  {Promise<import('../models/api.model').Api>}
 */
const getApiByModelId = async (modelId) => {
  const api = await Api.findOne({ model: modelId });
  if (!api) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Api not found');
  }
  return api;
};

/**
 *
 * @param {string} apiId
 * @param {Object} updateBody
 * @param {string} userId
 * @returns {Promise<string>}
 */
const updateApi = async (apiId, updateBody, userId) => {
  const api = await getApi(apiId);

  if (!api) {
    throw new Error('API not found');
  }

  const user = await userService.getUserById(userId);
  if (user.role !== 'admin' && String(api.created_by) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to update this api");
  }

  Object.assign(api, updateBody);
  await api.save();
  return api._id;
};

const deleteApi = async (apiId, userId) => {
  const api = await getApi(apiId);

  if (!api) {
    throw new ApiError(httpStatus.NOT_FOUND, 'API not found');
  }

  const user = await userService.getUserById(userId);
  if (user.role !== 'admin' && String(api.created_by) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to delete this api");
  }

  await api.remove();
};

module.exports = {
  createApi,
  getApi,
  getApiByModelId,
  updateApi,
  deleteApi,
};

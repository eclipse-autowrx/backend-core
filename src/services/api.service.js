const httpStatus = require('http-status');
const { userService } = require('.');
const { Api, Model, ExtendedApi } = require('../models');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const { isArray } = require('lodash');
const { sortObject } = require('../utils/sort');

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

const listVSSVersions = async () => {
  let versions;
  try {
    const rawData = fs.readFileSync(path.join(__dirname, '../../data/vss.json'));
    versions = rawData ? JSON.parse(rawData, 'utf8') : [];
  } catch (error) {
    logger.error(error);
    versions = [];
  }
  return versions;
};

/**
 *
 * @param {string} name
 * @returns {Promise<object>}
 */
const getVSSVersion = async (name) => {
  const filePath = path.join(__dirname, `../../data/${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VSS version not found');
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data;
};

/**
 *
 * @param {string} modelId
 */
const computeVSSApi = async (modelId) => {
  const model = await Model.findById(modelId);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  const apiVersion = model.api_version || 'v4.1';
  const ret = await getVSSVersion(apiVersion);

  const extendedApis = await ExtendedApi.find({
    model: modelId,
  });
  extendedApis.forEach((extendedApi) => {
    try {
      const name = extendedApi.apiName.split('.').slice(1).join('.');
      ret['Vehicle'].children[name] = {
        description: extendedApi.description,
        type: extendedApi.type,
        id: extendedApi._id,
      };
    } catch (error) {
      logger.warn(`Error while processing extended API ${extendedApi._id} with name ${extendedApi.apiName}: ${error}`);
    }
  });

  try {
    ret['Vehicle'].children = sortObject(ret['Vehicle'].children);
  } catch (error) {
    logger.warn(`Error while sorting object: ${error}`);
  }
  return ret;
};

module.exports = {
  createApi,
  getApi,
  getApiByModelId,
  updateApi,
  deleteApi,
  listVSSVersions,
  getVSSVersion,
  computeVSSApi,
};

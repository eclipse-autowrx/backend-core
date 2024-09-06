const permissionService = require('./permission.service');
const { PERMISSIONS, RESOURCES } = require('../config/roles');
const { Role } = require('../models');
const Asset = require('../models/asset.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

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

/**
 *
 * @param {string} assetId
 */
const deleteAsset = (assetId) => {
  return Asset.findOneAndDelete({
    _id: assetId,
  });
};

/**
 *
 * @param {string} id
 * @param {{
 *  role: 'read_asset' | 'write_asset',
 *  userId: string,
 * }} roleBody
 * @returns {Promise<void>}
 */
const addAuthorizedUser = async (id, roleBody) => {
  const role = await Role.findOne({
    ref: roleBody.role,
  });
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found');
  }
  // eslint-disable-next-line no-param-reassign
  roleBody.role = role._id;
  await permissionService.assignRoleToUser(roleBody.userId, roleBody.role, id);
};

/**
 *
 * @param {string} id
 * @param {{
 *  role: 'read_asset' | 'write_asset',
 *  userId: string,
 * }} roleBody
 * @param {string} userId
 * @returns {Promise<void>}
 */
const deleteAuthorizedUser = async (id, roleBody) => {
  const role = await Role.findOne({
    ref: roleBody.role,
  });
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found');
  }
  await permissionService.removeRoleFromUser(roleBody.userId, role, id);
};

module.exports = {
  createAsset,
  queryAssets,
  updateAsset,
  getAssetById,
  deleteAsset,
  addAuthorizedUser,
  deleteAuthorizedUser,
};

const httpStatus = require('http-status');
const { RESOURCE_TYPE } = require('../config/roles');
const { Permission, UserRole, Model, Prototype, Role } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 *
 * @param {{
 *  role: 'model_contributor' | 'model_member',
 *  ref: string,
 *  refType: 'model' | 'prototype',
 * }} condition
 * @returns {Promise<import('../models/user.model').User>}
 */
const listAuthorizedUser = async ({ role, ...condition }) => {
  const roleObject = await Role.findOne({ name: role });
  if (!roleObject) {
    return [];
  }
  const userRoles = await UserRole.find({
    ...condition,
    role: roleObject._id,
  }).populate('user');
  return userRoles.map((userRole) => userRole.user);
};

const createPermission = async (name, type) => {
  return Permission.create({
    name,
    type,
  });
};

const getPermissions = async () => {
  return Permission.find();
};

const assignRoleToUser = async (user, role, ref, refType) => {
  if (await UserRole.checkExist(user, role, ref, refType)) {
    return;
  }
  return UserRole.create({ user, role, ref, refType });
};

const removeRoleFromUser = async (user, role, ref, refType) => {
  return UserRole.deleteOne({ user, role, ref, refType });
};

const getUserRoles = async (user, filter) => {
  return UserRole.find({ user, ...filter }).populate('role');
};

const getRoleUsers = async (role) => {
  return UserRole.find({ role }).populate('user');
};

/**
 *
 * @param {string} userId
 * @param {'model'|'prototype'} permission
 * @param {string} [type]
 * @param {string} [id]
 * @param {string} [modelId]
 * @returns
 */
const hasPermission = async (userId, permission, type, id, modelId) => {
  if (type === 'model') {
    const model = await Model.findById(id);
    if (!model) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
    }
    if (String(model.created_by) === String(userId)) {
      return true;
    }
  }

  if (type === 'prototype') {
    const prototype = await Prototype.findById(id);
    if (!prototype) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Prototype not found');
    }
    if (String(prototype.created_by) === String(userId)) {
      return true;
    }
  }

  if (!userId) {
    return false;
  }

  const userRoles = await UserRole.find({
    user: userId,
    ref: modelId || id,
    refType: RESOURCE_TYPE.MODEL,
  }).populate('role');

  if (!userRoles.length) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const userRole of userRoles) {
    if (userRole.role.permissions.includes(permission)) {
      return true;
    }
  }
};

module.exports = {
  listAuthorizedUser,
  createPermission,
  getPermissions,
  assignRoleToUser,
  getUserRoles,
  getRoleUsers,
  hasPermission,
  removeRoleFromUser,
};

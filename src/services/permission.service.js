const httpStatus = require('http-status');
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

const assignRoleToUser = async (user, role, ref) => {
  if (await UserRole.checkExist(user, role, ref)) {
    return;
  }
  return UserRole.create({ user, role, ref });
};

const removeRoleFromUser = async (user, role, ref) => {
  return UserRole.deleteOne({ user, role, ref });
};

const getUserRoles = async (user, filter) => {
  return UserRole.find({ user, ...filter }).populate('role');
};

const getRoleUsers = async (role) => {
  return UserRole.find({ role }).populate('user');
};

// Create a map for better search performance
const getMappedRoles = (roles) => {
  const map = new Map();
  roles.forEach((role) => {
    const roleRef = role.ref || '*';

    if (map.has(roleRef)) {
      const existingRole = map.get(roleRef);
      existingRole.permissions.push(role.role.permissions);
    } else {
      map.set(roleRef, role.role.permissions);
    }
  });
  return map;
};

// Check if the role map contains the permission
const containsPermission = (roleMap, permission, modelId) => {
  const firstCondition = roleMap.has('*') && roleMap.get('*').includes(permission);
  const secondCondition = roleMap.has(modelId) && roleMap.get(modelId).includes(permission);
  return firstCondition || secondCondition;
};

const check = async (userId, permission, modelId) => {
  const userRoles = await getUserRoles(userId);
  const roleMap = getMappedRoles(userRoles);
  return containsPermission(roleMap, permission, modelId);
};

const checkModelPermission = (model, userId, permission) => {
  if (String(model.created_by) === String(userId)) {
    return true;
  }
  return check(userId, permission, model._id);
};

const checkPrototypePermission = (prototype, userId, permission) => {
  if (String(prototype.created_by) === String(userId)) {
    return true;
  }

  return check(userId, permission, prototype.model_id._id);
};

/**
 *
 * @param {string} userId
 * @param {string} [id]
 * @param {string} permission
 * @returns {Promise<boolean>}
 */
const hasPermission = async (userId, permission, id) => {
  const model = await Model.findById(id);
  const prototype = await Prototype.findById(id).populate('model_id');

  if (!userId) {
    return false;
  }

  if (id) {
    if (model) {
      return checkModelPermission(model, userId, permission);
    }
    if (prototype) {
      return checkPrototypePermission(prototype, userId, permission);
    }
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  } else {
    return check(userId, permission);
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
  getMappedRoles,
  containsPermission,
};

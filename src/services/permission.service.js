const httpStatus = require('http-status');
const { UserRole, Model, Prototype, Role } = require('../models');
const ApiError = require('../utils/ApiError');
const roleModel = require('../models/role.model');
const { PERMISSIONS, ROLES } = require('../config/roles');

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
  const roleObject = await Role.findOne({ ref: role });
  if (!roleObject) {
    return [];
  }
  const userRoles = await UserRole.find({
    ...condition,
    role: roleObject._id,
  }).populate('user', 'id image_file name');
  return userRoles.map((userRole) => userRole.user);
};

const getRoles = async () => {
  return roleModel.find();
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

const getRoleUsers = async () => {
  return UserRole.aggregate([
    {
      $group: {
        _id: '$role',
        users: { $push: '$user' },
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: '_id',
        foreignField: '_id',
        as: 'role',
      },
    },

    {
      $unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'users',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $addFields: {
        role: {
          id: '$role._id',
        },
        users: {
          $map: {
            input: '$users',
            as: 'user',
            in: {
              id: '$$user._id',
              name: '$$user.name',
              email: '$$user.email',
              email_verified: '$$user.email_verified',
              image_file: '$$user.image_file',
              provider: '$$user.provider',
              provider_data: '$$user.provider_data',
              createdAt: '$$user.createdAt',
              updatedAt: '$$user.updatedAt',
            },
          },
        },
      },
    },
    {
      $unset: ['_id', 'users._id', 'role._id'],
    },
  ]);
};

// Create a map for better search performance
const getMappedRoles = (roles) => {
  const map = new Map();
  roles.forEach((role) => {
    const roleRef = String(role.ref || '*');

    if (map.has(roleRef)) {
      const existingRole = map.get(roleRef);
      if (!existingRole.permissions) {
        existingRole.permissions = [];
      }
      existingRole.permissions.push(role.role.permissions);
    } else {
      map.set(roleRef, role.role.permissions);
    }
  });
  return map;
};

// Check if the role map contains the permission
const containsPermission = (roleMap, permission, modelId) => {
  const stringModelId = String(modelId);
  const firstCondition = roleMap.has('*') && roleMap.get('*').includes(permission);
  const secondCondition = roleMap.has(stringModelId) && roleMap.get(stringModelId).includes(permission);
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
  const model = await Model.findById(id).select('created_by');
  const prototype = await Prototype.findById(id).populate('model_id').select('created_by model_id');

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

const getPermissions = () => {
  return Role.find({
    not_feature: {
      $ne: true,
    },
  });
};

/**
 *
 * @param {string} userId
 * @returns {Promise<string[] | '*'>}
 */
const listReadableModelIds = async (userId) => {
  // If user is not logged in return public models
  if (!userId) {
    return (await Model.find({ visibility: 'public' }).select('_id')).map((model) => String(model._id));
  }

  const userRoles = await getUserRoles(userId);
  const roleMap = getMappedRoles(userRoles);

  // If user has permission to read all models return '*'
  if (roleMap.has('*') && roleMap.get('*').includes(PERMISSIONS.READ_MODEL)) {
    return '*';
  }

  const results = new Set();

  // Add authorized models
  roleMap.forEach((value, key) => {
    if ((value || []).includes(PERMISSIONS.READ_MODEL)) {
      results.add(key);
    }
  });
  // Add own models
  const ownModels = await Model.find({ created_by: userId }).select('_id');
  ownModels.forEach((model) => {
    results.add(String(model._id));
  });
  // Add public models
  const publicModels = await Model.find({ visibility: 'public' }).select('_id');
  publicModels.forEach((model) => {
    results.add(String(model._id));
  });

  return Array.from(results);
};

module.exports = {
  listAuthorizedUser,
  assignRoleToUser,
  getUserRoles,
  getRoleUsers,
  hasPermission,
  removeRoleFromUser,
  getMappedRoles,
  containsPermission,
  getRoles,
  getPermissions,
  listReadableModelIds,
};

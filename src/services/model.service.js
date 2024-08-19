const httpStatus = require('http-status');
const { userService } = require('.');
const permissionService = require('./permission.service');
const { Model, Role } = require('../models');
const ApiError = require('../utils/ApiError');
const { PERMISSIONS } = require('../config/roles');
const mongoose = require('mongoose');

/**
 *
 * @param {string} userId
 * @param {Object} modelBody
 * @returns {Promise<string>}
 */
const createModel = async (userId, modelBody) => {
  const user = await userService.getUserById(userId);

  if (user.role !== 'admin') {
    const count = await Model.countDocuments({ created_by: userId });
    if (count >= 3) {
      if (!(await permissionService.hasPermission(userId, PERMISSIONS.UNLIMITED_MODEL))) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Users are limited to 3 models');
      }
    }
  }

  const model = await Model.create({
    ...modelBody,
    created_by: userId,
  });
  return model._id;
};

/**
 * Query for models with filters
 * @param {Object} filter
 */
const getModels = async (filter) => {
  return Model.find(filter);
};

/**
 * Query for users with filters, pagination and authorized user check
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {fields} [options.fields] - Fields to select
 * @returns {Promise<QueryResult>}
 */
const queryModels = async (filter, options, advanced, userId) => {
  const { sortBy, limit = 10, page = 1, fields } = options;

  // Cast id to ObjectId if have
  if (filter.id) {
    filter._id = new mongoose.Types.ObjectId(filter.id);
    delete filter.id;
  }
  if (filter.created_by) {
    filter.created_by = new mongoose.Types.ObjectId(filter.created_by);
  }

  const pipeline = [{ $match: filter }];

  const permissionFilter = {
    $or: [],
  };

  if (!advanced.is_contributor) {
    permissionFilter.$or.push({ visibility: 'public' });
  }

  // List based on permissions
  if (userId) {
    const roles = await permissionService.getUserRoles(userId);
    const roleMap = permissionService.getMappedRoles(roles);
    const objectRoleMap = Object.fromEntries(roleMap.entries());

    permissionFilter.$or.push(
      ...[
        { created_by: userId },
        { created_by: { _id: userId } },
        {
          $expr: {
            $function: {
              body: `function (map, modelId, permission, requesterId, createdById) {
                const stringModelId = modelId.toString();
                const stringCreatedById = createdById.toString();
                return (map && map[stringModelId] && map[stringModelId].includes(permission)) || (requesterId == stringCreatedById);
              }`,
              args: [
                objectRoleMap,
                { $toString: '$_id' },
                PERMISSIONS.READ_MODEL,
                userId || null,
                { $toString: '$created_by' },
              ],
              lang: 'js',
            },
          },
        },
      ]
    );
  }

  if (permissionFilter.$or.length > 0) {
    pipeline.push({ $match: permissionFilter });
  }

  if (fields) {
    pipeline.push({ $project: fields.split(',').reduce((acc, field) => ({ ...acc, [field]: 1 }), {}) });
  }

  const totalResults = await Model.aggregate([...pipeline, { $count: 'count' }]).exec();

  if (sortBy) {
    const [sortField, sortOrder] = sortBy.split(':');
    pipeline.push({ $sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 } });
  }

  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  pipeline.push(
    ...[
      {
        $lookup: {
          from: 'users',
          let: { created_by: '$created_by' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$created_by'],
                },
              },
            },
            {
              $project: {
                id: '$_id',
                image_file: 1,
                name: 1,
                _id: 0,
              },
            },
          ],
          as: 'created_by',
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  );

  const models = await Model.aggregate(pipeline).exec();

  const totalResultsCount = totalResults.length > 0 ? totalResults[0].count : 0;
  const totalPages = Math.ceil(totalResultsCount / limit);

  return {
    results: models.map((model) => {
      const { _id, ...rest } = model;
      return {
        ...rest,
        id: _id,
      };
    }),
    page,
    limit,
    totalPages,
    totalResults: totalResultsCount,
  };
};

/**
 *
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<Model>}
 */
const getModelById = async (id, userId) => {
  const model = await Model.findById(id).populate('created_by', 'id name image_file');
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  if (model.visibility === 'private') {
    if (!userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
    if (!(await permissionService.hasPermission(userId, PERMISSIONS.READ_MODEL, id))) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  return model;
};

/**
 *
 * @param {string} id
 * @param {Object} updateBody
 * @param {userId} string
 * @returns {Promise<string>}
 */
const updateModelById = async (id, updateBody, userId) => {
  const model = await getModelById(id, userId);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }

  Object.assign(model, updateBody);
  await model.save();
  return model._id;
};

/**
 *
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<void>}
 */
const deleteModelById = async (id, userId) => {
  const model = await getModelById(id, userId);

  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }

  await model.remove();
};

/**
 *
 * @param {string} id
 * @param {{
 *  role: 'model_contributor' | 'model_member',
 *  userId: string,
 * }} roleBody
 * @param {string} userId
 * @returns {Promise<void>}
 */
const addAuthorizedUser = async (id, roleBody, userId) => {
  const role = await Role.findOne({
    ref: roleBody.role,
  });
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found');
  }
  // eslint-disable-next-line no-param-reassign
  roleBody.role = role._id;
  if (!(await permissionService.hasPermission(userId, PERMISSIONS.WRITE_MODEL, id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await permissionService.assignRoleToUser(roleBody.userId, roleBody.role, id, 'model');
};

/**
 *
 * @param {string} id
 * @param {{
 *  role: 'model_contributor' | 'model_member',
 *  userId: string,
 * }} roleBody
 * @param {string} userId
 * @returns {Promise<void>}
 */
const deleteAuthorizedUser = async (id, roleBody, userId) => {
  const role = await Role.findOne({
    ref: roleBody.role,
  });
  if (!(await permissionService.hasPermission(userId, PERMISSIONS.WRITE_MODEL, id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await permissionService.removeRoleFromUser(roleBody.userId, role, id, 'model');
};

const getAccessibleModels = async (userId) => {
  const roles = await permissionService.getUserRoles(userId);
  const roleMap = permissionService.getMappedRoles(roles);
  const objectRoleMap = Object.fromEntries(roleMap.entries());

  const visibleModels = await Model.find({
    $or: [
      { visibility: 'public' },
      { created_by: userId },
      {
        $expr: {
          $function: {
            body: `function (map, modelId, permission, requesterId, createdById) {
            const stringModelId = modelId.toString();
            const stringCreatedById = createdById.toString();
            return (map && map[stringModelId] && map[stringModelId].includes(permission)) || (requesterId == stringCreatedById);
          }`,
            args: [
              objectRoleMap,
              { $toString: '$_id' },
              PERMISSIONS.READ_MODEL,
              userId || null,
              { $toString: '$created_by' },
            ],
            lang: 'js',
          },
        },
      },
    ],
  });

  return visibleModels;
};

module.exports = {
  createModel,
  getModels,
  queryModels,
  getModelById,
  updateModelById,
  deleteModelById,
  addAuthorizedUser,
  deleteAuthorizedUser,
  getAccessibleModels,
};

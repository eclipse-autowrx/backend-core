const httpStatus = require('http-status');
const { userService } = require('.');
const { Model } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 *
 * @param {string} userId
 * @param {Object} modelBody
 * @returns {Promise<Model>}
 */
const createModel = async (userId, modelBody) => {
  const user = await userService.getUserById(userId);

  if (!user.isSystemAdmin) {
    const count = await Model.countDocuments({ created_by: userId });
    if (count >= 3) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Users are limited to 3 models');
    }
  }

  const model = await Model.create({
    ...modelBody,
    created_by: userId,
  });
  return model._id;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {fields} [options.fields] - Fields to select
 * @returns {Promise<QueryResult>}
 */
const queryModels = async (filter, options) => {
  const models = await Model.paginate(filter, options);
  return models;
};

/**
 *
 * @param {string} id
 * @returns {Promise<Model>}
 */
const getModelById = async (id) => {
  return Model.findById(id);
};

/**
 *
 * @param {string} id
 * @param {Object} updateBody
 * @param {userId} string
 * @returns {Promise<string>}
 */
const updateModelById = async (id, updateBody, userId) => {
  const model = await getModelById(id);

  const user = await userService.getUserById(userId);

  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  if (!user.isSystemAdmin && String(model.created_by) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to update this model");
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
  const model = await getModelById(id);

  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  const user = await userService.getUserById(userId);
  if (!user.isSystemAdmin && String(model.created_by) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission to delete this model");
  }

  await model.remove();
};

module.exports = {
  createModel,
  queryModels,
  getModelById,
  updateModelById,
  deleteModelById,
};

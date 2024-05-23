const httpStatus = require('http-status');
const { Prototype } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 *
 * @param {string} userId
 * @param {Object} prototypeBody
 * @returns {Promise<string>}
 */
const createPrototype = async (userId, prototypeBody) => {
  if (await Prototype.existsPrototypeInModel(prototypeBody.model_id, prototypeBody.name)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Duplicate prototype name '${prototypeBody.name}' in model ${prototypeBody.model_id}`
    );
  }

  const prototype = await Prototype.create({
    ...prototypeBody,
    created_by: userId,
  });
  return prototype._id;
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
const queryPrototypes = async (filter, options) => {
  const prototypes = await Prototype.paginate(filter, options);
  return prototypes;
};

/**
 *
 * @param {string} id
 * @returns {Promise<import('../models/prototype.model').Prototype>}
 */
const getPrototypeById = async (id) => {
  const prototype = await Prototype.findById(id);
  return prototype;
};

/**
 *
 * @param {string} id
 * @param {Object} updateBody
 * @param {string} userId
 * @returns {Promise<import("../models/prototype.model").Prototype>}
 */
const updatePrototypeById = async (id, updateBody, userId) => {
  const prototype = await getPrototypeById(id);
  if (!prototype) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prototype not found');
  }

  if (String(prototype.created_by) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  if (updateBody.name && (await Prototype.existsPrototypeInModel(prototype.model_id, updateBody.name, id))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Duplicate prototype name '${updateBody.name}' in model ${prototype.model_id}`
    );
  }

  Object.assign(prototype, updateBody);
  await prototype.save();

  return prototype;
};

module.exports = {
  createPrototype,
  queryPrototypes,
  getPrototypeById,
  updatePrototypeById,
};

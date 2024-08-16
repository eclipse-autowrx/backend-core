const httpStatus = require('http-status');
const { Prototype } = require('../models');
const ApiError = require('../utils/ApiError');
const permissionService = require('./permission.service');
const { PERMISSIONS } = require('../config/roles');
const { default: axios, isAxiosError } = require('axios');
const config = require('../config/config');
const logger = require('../config/logger');

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
  return prototype;
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
const getPrototypeById = async (id, userId) => {
  const prototype = await Prototype.findById(id).populate([
    {
      path: 'created_by',
      select: 'name image_file',
    },
    {
      path: 'model_id',
      select: 'name visibility',
    },
  ]);

  if (!prototype) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prototype not found');
  }

  if (prototype.model_id.visibility === 'private') {
    if (!(await permissionService.hasPermission(userId, PERMISSIONS.READ_MODEL, id))) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    }
  }
  return prototype;
};

/**
 *
 * @param {string} id
 * @param {Object} updateBody
 * @returns {Promise<import("../models/prototype.model").Prototype>}
 */
const updatePrototypeById = async (id, updateBody) => {
  const prototype = await Prototype.findById(id);
  if (!prototype) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prototype not found');
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

/**
 *
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<void>}
 */
const deletePrototypeById = async (id) => {
  const prototype = await Prototype.findById(id);
  if (!prototype) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prototype not found');
  }

  await prototype.remove();
};

/**
 *
 * @param {string} userId
 */
const getRecentCachedPrototypes = async (userId) => {
  /**
   * @type {Array<import('../typedefs/cacheDef').CacheEntity>}
   */
  let recentData = [];
  try {
    recentData = (await axios.get(`${config.services.cache.baseUrl}/get-recent-activities/${userId}`)).data;
  } catch (error) {
    if (isAxiosError(error)) {
      logger.error('Error while getting recent prototypes from cache', error.response?.data?.message || error.message);
    } else {
      logger.error('Error while getting recent prototypes from cache', error.message);
    }
  }
  return recentData;
};

/**
 *
 * @param {string} userId
 */
const listRecentPrototypes = async (userId) => {
  const recentData = await getRecentCachedPrototypes(userId);

  // Create map
  const prototypeMap = new Map();
  recentData.forEach((data) => {
    prototypeMap.set(data.referenceId, data);
  });

  const prototypes = await Prototype.find({ _id: { $in: Array.from(prototypeMap.keys()) } })
    .select('name model_id description image_file executed_turns')
    .populate('model', 'name visibility');
  return prototypes.map((prototype) => {
    return {
      ...prototype.toJSON(),
      last_visited: prototypeMap.get(prototype.id).time,
      last_page: prototypeMap.get(prototype.id).page,
    };
  });
};

/**
 *
 * @param {string} id
 * @param {Object} [body]
 * @returns {Promise<void>}
 */
const executeCode = async (id, _) => {
  const prototype = await Prototype.findById(id);
  prototype.executed_turns += 1;
  await prototype.save();
};

/**
 *
 * @returns {Promise<import('../typedefs/prototypeDef').Prototype[]>}
 */
const listPopularPrototypes = async () => {
  return Prototype.find()
    .sort({ executed_turns: -1 })
    .limit(8)
    .select('name model_id description image_file executed_turns')
    .populate('model', 'name visibility');
};

module.exports = {
  createPrototype,
  queryPrototypes,
  getPrototypeById,
  updatePrototypeById,
  deletePrototypeById,
  listRecentPrototypes,
  executeCode,
  listPopularPrototypes,
};

const httpStatus = require('http-status');
const { Timestamp } = require('firebase-admin/firestore');
const ApiError = require('../utils/ApiError');
const { db } = require('../config/firebase');

/**
 *
 * @param {Object} modelBody
 * @returns {Promise<string>}
 */
const createModel = async (modelBody) => {
  const { userId, ...data } = modelBody;
  const newModelRef = db.collection('model').doc();
  await newModelRef.set({
    ...data,
    id: newModelRef.id,
    created: {
      created_time: Timestamp.now(),
      user_uid: userId,
    },
  });

  return newModelRef.id;
};

/**
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
const getModelById = async (id) => {
  const model = (await db.collection('model').doc(id).get()).data();
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  return model;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModels = async (filter, options) => {
  const retModels = [];

  const { fields, ...restFilter } = filter;

  const fieldsArr = fields ? fields.split(',') : [];

  let query = db.collection('model');

  Object.keys(restFilter).forEach((key) => {
    query = query.where(key, 'in', restFilter[key].split(',').slice(0, 30));
  });

  if (fieldsArr.length > 0) {
    query = query.select(...fieldsArr);
  }

  const models = await query.get();

  if (!models.empty) {
    models.forEach((model) => {
      retModels.push(model.data());
    });
  }

  return retModels;
};

/**
 *
 * @param {string} id
 * @param {Object} modelBody
 * @returns {Promise<Object>}
 */
const updateModelById = async (id, modelBody) => {
  const { custom_apis, ...data } = modelBody;

  const modelRef = db.collection('model').doc(id);
  const model = await modelRef.get();

  if (!model.exists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }

  if (custom_apis) {
    const docSnap = await modelRef.get();

    const parsedCustomApis = JSON.parse(custom_apis);

    const newCustomApis = docSnap.data().custom_apis || {};

    Object.entries(parsedCustomApis).forEach(([nesting, value]) => {
      newCustomApis[nesting] = {
        ...newCustomApis[nesting],
        ...value,
      };
    });

    data.custom_apis = newCustomApis;
  }

  const result = await modelRef.update(data);

  return result;
};

/**
 *
 * @param {string} id
 * @param {Object} tagBody
 * @param {boolean} rough
 * @returns {Promise<Object>}
 */
const updateTag = async (id, tagBody, rough) => {
  let newTags = [];

  const modelRef = db.collection('model').doc(id);
  if (!rough) {
    const { tag, tagCategory, tagDetail } = tagBody;
    const docSnap = await modelRef.get();
    const existingModel = docSnap.data();
    const existingTag = existingModel?.tags?.find((t) => t.tag === tag.name && t.tagCategoryId === tagCategory.id);

    if (existingTag) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tag already exists');
    }
    newTags = existingModel?.tags ? [...existingModel.tags, tagDetail] : [tagDetail];
  } else {
    newTags = tagBody.tags;
  }

  const result = await modelRef.update({ tags: newTags });
  return result;
};

const divideNodeName = (node_name) => {
  const parts = node_name.split('.');
  const [nesting, name] = [parts.slice(0, -1).join('.'), parts.slice(-1)[0]];

  return [nesting, name];
};

/**
 *
 * @param {string} id
 * @param {*} node_name
 * @returns {Promise<Object>}
 */
const deleteApi = async (id, node_name) => {
  const modelRef = db.collection('model').doc(id);
  const model = (await modelRef.get()).data();
  const custom_apis = model.custom_apis ?? {};
  const [nesting, name] = divideNodeName(node_name);

  // eslint-disable-next-line no-restricted-syntax
  const newCustomApis = Object.keys(custom_apis).reduce((acc, key) => {
    const value = custom_apis[key];
    if (nesting === key) {
      const newValue = {};
      Object.entries(value).forEach(([k, v]) => {
        if (k !== name) {
          newValue[k] = v;
        }
      });
      if (Object.keys(newValue).length) {
        return { ...acc, [key]: newValue };
      }
      return acc;
    }

    if (key === node_name || key.startsWith(`${node_name}.`)) return acc;

    return { ...acc, [key]: custom_apis[key] };
  }, {});

  const result = await modelRef.update({ custom_apis: newCustomApis });
  return result;
};

module.exports = {
  createModel,
  getModelById,
  queryModels,
  updateModelById,
  updateTag,
  deleteApi,
};

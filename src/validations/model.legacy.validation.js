const Joi = require('joi');
const { visibilityTypes } = require('../config/enums');
const { jsonString, slug } = require('./custom.validation');

const createModel = {
  body: Joi.object().keys({
    custom_apis: Joi.string().custom(jsonString),
    cvi: Joi.string().required().custom(jsonString),
    main_api: Joi.string().required().max(255),
    model_home_image_file: Joi.string().allow(''),
    model_files: Joi.object(),
    name: Joi.string().required().max(255),
    visibility: Joi.string()
      .valid(...Object.values(visibilityTypes))
      .required(),
    tenant_id: Joi.string().required().max(255),
    vehicle_category: Joi.string().required().max(255),
    property: Joi.string().custom(jsonString),
    skeleton: Joi.string().custom(jsonString),
    tags: Joi.array().items(
      Joi.object().keys({
        tag: Joi.string().required(),
        tagCategoryId: Joi.string().required().custom(slug),
        tagCategoryName: Joi.string().required(),
      })
    ),
  }),
};

const getModel = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const listModels = {
  query: Joi.object().keys({
    name: Joi.string(),
    visibility: Joi.string().valid(...Object.values(visibilityTypes)),
    tenant_id: Joi.string(),
    vehicle_category: Joi.string(),
    main_api: Joi.string(),
    fields: Joi.string(),
    id: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateModel = {
  body: Joi.object().keys({
    custom_apis: Joi.string().allow(''),
    cvi: Joi.string(),
    main_api: Joi.string(),
    model_home_image_file: Joi.string().allow(''),
    model_files: Joi.object(),
    name: Joi.string(),
    visibility: Joi.string().valid(...Object.values(visibilityTypes)),
    tenant_id: Joi.string(),
    vehicle_category: Joi.string(),
    property: Joi.string().allow(null, ''),
    skeleton: Joi.string().allow(null, ''),
    tags: Joi.array().items(
      Joi.object().keys({
        tag: Joi.string(),
        tagCategoryId: Joi.string(),
        tagCategoryName: Joi.string(),
      })
    ),
  }),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateTag = {
  body: Joi.alternatives()
    .try(
      Joi.object({
        tag: Joi.object().required(),
        tagCategory: Joi.object().required(),
        tagDetail: Joi.object().required(),
      }),
      Joi.object({
        tags: Joi.array().items(Joi.any()).required(),
      })
    )
    .required(),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  query: Joi.object().keys({
    rough: Joi.boolean().default(false),
  }),
};

const deleteApi = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  query: Joi.object().keys({
    node_name: Joi.string().required(),
  }),
};

module.exports = {
  createModel,
  getModel,
  listModels,
  updateModel,
  updateTag,
  deleteApi,
};

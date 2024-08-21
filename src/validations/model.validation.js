const Joi = require('joi');
const { visibilityTypes } = require('../config/enums');
const { jsonString, slug, objectId } = require('./custom.validation');

const createModel = {
  body: Joi.object().keys({
    extend: Joi.any(),
    custom_apis: Joi.string().custom(jsonString),
    cvi: Joi.string().required().custom(jsonString),
    main_api: Joi.string().required().max(255),
    model_home_image_file: Joi.string()
      .allow('')
      .default(
        'https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fcar_full_ed.PNG?alt=media&token=ea75b8c1-a57a-44ea-9edb-9816131f9905'
      ),
    model_files: Joi.object(),
    name: Joi.string().required().max(255),
    visibility: Joi.string()
      .valid(...Object.values(visibilityTypes))
      .default('private'),
    vehicle_category: Joi.string().default('Passenger cars').max(255),
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

const listModels = {
  query: Joi.object().keys({
    name: Joi.string(),
    visibility: Joi.string().valid(...Object.values(visibilityTypes)),
    tenant_id: Joi.string(),
    vehicle_category: Joi.string(),
    main_api: Joi.string(),
    fields: Joi.string(),
    id: Joi.string().custom(objectId),
    created_by: Joi.string().custom(objectId),
    is_contributor: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateModel = {
  body: Joi.object()
    .keys({
      extend: Joi.any(),
      custom_apis: Joi.string().custom(jsonString),
      cvi: Joi.string().custom(jsonString),
      main_api: Joi.string().max(255),
      model_home_image_file: Joi.string().allow(''),
      model_files: Joi.object(),
      name: Joi.string().max(255),
      visibility: Joi.string().valid(...Object.values(visibilityTypes)),
      vehicle_category: Joi.string().max(255),
      property: Joi.string().custom(jsonString),
      skeleton: Joi.string().custom(jsonString),
      tags: Joi.array().items(
        Joi.object().keys({
          tag: Joi.string().required(),
          tagCategoryId: Joi.string().required().custom(slug),
          tagCategoryName: Joi.string().required(),
        })
      ),
    })
    .min(1),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const getModel = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const deleteModel = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const addAuthorizedUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    role: Joi.string().valid('model_contributor', 'model_member'),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const deleteAuthorizedUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    role: Joi.string().valid('model_contributor', 'model_member'),
  }),
};

module.exports = {
  createModel,
  listModels,
  updateModel,
  getModel,
  deleteModel,
  addAuthorizedUser,
  deleteAuthorizedUser,
};

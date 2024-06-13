const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createExtendedApi = {
  body: Joi.object().keys({
    apiName: Joi.string().required(),
    model: Joi.string().custom(objectId).required(),
    skeleton: Joi.string().optional(),
    tags: Joi.array()
      .items(
        Joi.object({
          tagCategoryId: Joi.string(),
          tagCategoryName: Joi.string(),
          tag: Joi.string(),
        })
      )
      .optional(),
  }),
};

const getExtendedApis = {
  query: Joi.object().keys({
    apiName: Joi.string(),
    model: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getExtendedApi = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateExtendedApi = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      apiName: Joi.string(),
      model: Joi.string().custom(objectId),
      skeleton: Joi.string().optional(),
      tags: Joi.array()
        .items(
          Joi.object({
            tagCategoryId: Joi.string(),
            tagCategoryName: Joi.string(),
            tag: Joi.string(),
          })
        )
        .optional(),
    })
    .min(1),
};

const deleteExtendedApi = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createExtendedApi,
  getExtendedApis,
  getExtendedApi,
  updateExtendedApi,
  deleteExtendedApi,
};

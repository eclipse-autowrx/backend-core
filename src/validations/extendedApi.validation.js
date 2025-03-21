const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createExtendedApi = {
  body: Joi.object().keys({
    apiName: Joi.string().required(),
    model: Joi.string().custom(objectId).required(),
    skeleton: Joi.string().optional(),
    type: Joi.string(),
    datatype: Joi.alternatives().conditional('type', {
      is: 'branch',
      then: Joi.string().allow(null).optional(),
      otherwise: Joi.string().required(),
    }),
    description: Joi.string().allow('').default(''),
    tags: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().allow(''),
      })
    ),
    isWishlist: Joi.boolean().default(false),
    unit: Joi.string().allow('', null),
  }),
};

const getExtendedApis = {
  query: Joi.object().keys({
    apiName: Joi.string(),
    model: Joi.string().custom(objectId).required(),
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
      apiName: Joi.string()
        .regex(/^Vehicle\./)
        .message('apiName must start with Vehicle.'),
      skeleton: Joi.string().optional(),
      type: Joi.string(),
      datatype: Joi.alternatives().conditional('type', {
        is: 'branch',
        then: Joi.string().allow(null).optional(),
        otherwise: Joi.string(),
      }),
      description: Joi.string().allow(''),
      tags: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          description: Joi.string().allow(''),
        })
      ),
      isWishlist: Joi.boolean(),
      unit: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteExtendedApi = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const getExtendedApiByApiNameAndModel = {
  query: Joi.object().keys({
    apiName: Joi.string().required(),
    model: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createExtendedApi,
  getExtendedApis,
  getExtendedApi,
  updateExtendedApi,
  deleteExtendedApi,
  getExtendedApiByApiNameAndModel,
};

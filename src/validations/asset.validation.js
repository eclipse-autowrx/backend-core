const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAsset = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    data: Joi.any(),
  }),
};

const getAssets = {
  query: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAsset = {
  params: Joi.object().keys({
    assetId: Joi.string().required().custom(objectId),
  }),
};

const updateAsset = {
  params: Joi.object().keys({
    assetId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      type: Joi.string(),
      data: Joi.any(),
    })
    .min(1),
};

const deleteAsset = {
  params: Joi.object().keys({
    assetId: Joi.string().required().custom(objectId),
  }),
};

const generateToken = {
  params: Joi.object().keys({
    assetId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createAsset,
  getAssets,
  updateAsset,
  getAsset,
  deleteAsset,
  generateToken,
};

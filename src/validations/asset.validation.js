const Joi = require('joi');
const { query } = require('../config/logger');

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

module.exports = {
  createAsset,
  getAssets,
};

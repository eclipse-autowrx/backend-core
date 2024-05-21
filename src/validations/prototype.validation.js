const Joi = require('joi');

const listPrototypes = {
  query: Joi.object().keys({
    state: Joi.string(),
    model_id: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  listPrototypes,
};

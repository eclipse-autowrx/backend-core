const Joi = require('joi');

const search = {
  query: Joi.object().keys({
    q: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().default(10),
    page: Joi.number().integer(),
  }),
};

const searchUserByEmail = {
  params: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const searchPrototypesBySignal = {
  params: Joi.object().keys({
    signal: Joi.string().required(),
  }),
};

module.exports = {
  search,
  searchUserByEmail,
  searchPrototypesBySignal,
};

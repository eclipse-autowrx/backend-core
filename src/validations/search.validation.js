const Joi = require('joi');

const search = {
  query: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

module.exports = {
  search,
};

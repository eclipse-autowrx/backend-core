const Joi = require('joi');

const search = {
  params: Joi.object().keys({
    q: Joi.string().required(),
  }),
};

module.exports = {
  search,
};

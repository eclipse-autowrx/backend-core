const Joi = require('joi');

const getRegulations = {
  query: Joi.object().keys({
    vehicleApis: Joi.string().required(),
  }),
};

module.exports = {
  getRegulations,
};

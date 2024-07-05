const Joi = require('joi');

const invokeOpenAI = {
  body: Joi.object().keys({
    inputPrompt: Joi.string().required(),
    systemMessage: Joi.string().allow('').default(''),
    user: Joi.string(),
  }),
};

const invokeBedrock = {
  body: Joi.object().keys({
    endpointURL: Joi.string().required(),
    inputPrompt: Joi.string().required(),
    systemMessage: Joi.string().allow('').default(''),
    user: Joi.string(),
  }),
};

module.exports = {
  invokeOpenAI,
  invokeBedrock,
};

const Joi = require('joi');

const sendEmail = {
  body: Joi.object().keys({
    to: Joi.string().email().required(),
    subject: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

module.exports = { sendEmail };

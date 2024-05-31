const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDiscussion = {
  body: Joi.object().keys({
    content: Joi.string().required().max(2000),
    ref: Joi.string().required().custom(objectId),
    ref_type: Joi.string().required(),
    parent: Joi.string().custom(objectId),
  }),
};

const listDiscussions = {
  query: Joi.object().keys({
    ref: Joi.string().custom(objectId),
    ref_type: Joi.string(),
    id: Joi.string().custom(objectId),
    parent: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
    fields: Joi.string(),
  }),
};

module.exports = {
  createDiscussion,
  listDiscussions,
};

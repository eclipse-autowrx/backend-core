const Joi = require('joi');

const listTagCategories = {
  query: Joi.object().keys({
    tenantId: Joi.string().required(),
  }),
};

const createTag = {
  body: Joi.object().keys({
    newTag: Joi.object().required(),
    newTagCategory: Joi.object().required(),
    id: Joi.string().required(),
    tenantId: Joi.string().required(),
  }),
};

const updateTagCategory = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    tags: Joi.object(),
  }),
};

const createTagCategory = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string(),
    color: Joi.string(),
    tags: Joi.object(),
    tenant_id: Joi.string().required(),
  }),
};

module.exports = {
  listTagCategories,
  createTag,
  updateTagCategory,
  createTagCategory,
};

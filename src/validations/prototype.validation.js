const Joi = require('joi');

const listPrototypes = {
  query: Joi.object().keys({
    state: Joi.string(),
    model_id: Joi.string(),
    fields: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updatePrototype = {
  body: Joi.object().keys({
    apis: Joi.object().keys({
      VSC: Joi.array().items(Joi.string()),
      VSS: Joi.array().items(Joi.string()),
    }),
    code: Joi.string().allow(''),
    complexity_level: Joi.number(),
    customer_journey: Joi.string().allow(''),
    description: Joi.object().keys({
      problem: Joi.string().allow(''),
      says_who: Joi.string().allow(''),
      solution: Joi.string().allow(''),
      status: Joi.string().allow(''),
    }),
    image_file: Joi.string().allow(''),
    name: Joi.string(),
    portfolio: Joi.object().keys({
      effort_estimation: Joi.number(),
      needs_addressed: Joi.number(),
      relevance: Joi.number(),
    }),
    state: Joi.string().allow('development', 'released'),
    skeleton: Joi.string().allow(''),
    widget_config: Joi.string().allow(),
    rated_by: Joi.object(),
    partner_logo: Joi.string().allow(''),
    journey_image_file: Joi.string().allow(''),
    analysis_image_file: Joi.string().allow(''),
    related_ea_components: Joi.string().allow(''),
    tags: Joi.array().items(
      Joi.object().keys({
        tag: Joi.string().required(),
        tagCategoryId: Joi.string().required(),
        tagCategoryName: Joi.string().required(),
      })
    ),
  }),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getRecentPrototypes = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const createPrototype = {
  body: Joi.object().keys({
    state: Joi.string().allow('development', 'released'),
    apis: Joi.object().keys({
      VSC: Joi.array().items(Joi.string()),
      VSS: Joi.array().items(Joi.string()),
    }),
    code: Joi.string().allow(''),
    description: Joi.object().keys({
      problem: Joi.string().allow(''),
      says_who: Joi.string().allow(''),
      solution: Joi.string().allow(''),
      status: Joi.string().allow(''),
    }),
    complexity_level: Joi.number(),
    customer_journey: Joi.string().allow(''),
    image_file: Joi.string().allow(''),
    name: Joi.string(),
    portfolio: Joi.object().keys({
      effort_estimation: Joi.number(),
      needs_addressed: Joi.number(),
      relevance: Joi.number(),
    }),
    skeleton: Joi.string().allow(''),
    widget_config: Joi.string().allow(),
    rated_by: Joi.object(),
    userId: Joi.string().required(),
    model_id: Joi.string().required(),
    partner_logo: Joi.string().allow(''),
    journey_image_file: Joi.string().allow(''),
    analysis_image_file: Joi.string().allow(''),
    related_ea_components: Joi.string().allow(''),
  }),
};

const deletePrototype = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  listPrototypes,
  updatePrototype,
  getRecentPrototypes,
  createPrototype,
  deletePrototype,
};

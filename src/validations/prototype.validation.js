const Joi = require('joi');
const { stateTypes } = require('../config/enums');
const { objectId, jsonString, slug } = require('./custom.validation');

const createPrototype = {
  body: Joi.object().keys({
    extend: Joi.any(),
    state: Joi.string().allow(...Object.values(stateTypes)),
    apis: Joi.object().keys({
      VSC: Joi.array().items(Joi.string()),
      VSS: Joi.array().items(Joi.string()),
    }),
    code: Joi.string().allow(''),
    complexity_level: Joi.number().min(1).max(5),
    customer_journey: Joi.string().allow(''),
    description: Joi.object().keys({
      problem: Joi.string().allow('').max(4095),
      says_who: Joi.string().allow('').max(4095),
      solution: Joi.string().allow('').max(4095),
      status: Joi.string().allow('').max(255),
    }),
    image_file: Joi.string().allow(''),
    journey_image_file: Joi.string().allow(''),
    analysis_image_file: Joi.string().allow(''),
    model_id: Joi.string().required().custom(objectId),
    name: Joi.string().required().max(255),
    portfolio: Joi.object().keys({
      effort_estimation: Joi.number(),
      needs_addressed: Joi.number(),
      relevance: Joi.number(),
    }),
    skeleton: Joi.string().custom(jsonString),
    tags: Joi.array().items(
      Joi.object().keys({
        tag: Joi.string().required(),
        tagCategoryId: Joi.string().required().custom(slug),
        tagCategoryName: Joi.string().required(),
      })
    ),
    widget_config: Joi.string().custom(jsonString),
    autorun: Joi.boolean(),
    related_ea_components: Joi.string().allow(''),
    partner_logo: Joi.string().allow(''),
    // rated_by: Joi.object().pattern(
    //   /^[0-9a-fA-F]{24}$/,
    //   Joi.object()
    //     .required()
    //     .keys({
    //       rating: Joi.number().min(1).max(5),
    //     })
    // ),
  }),
};

const listPrototypes = {
  query: Joi.object().keys({
    state: Joi.string(),
    model_id: Joi.string().custom(objectId),
    name: Joi.string(),
    complexity_level: Joi.number().min(1).max(5),
    autorun: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    fields: Joi.string(),
    populate: Joi.string(),
  }),
};

const getPrototype = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updatePrototype = {
  body: Joi.object().keys({
    extend: Joi.any(),
    state: Joi.string().allow(...Object.values(stateTypes)),
    apis: Joi.object().keys({
      VSC: Joi.array().items(Joi.string()),
      VSS: Joi.array().items(Joi.string()),
    }),
    code: Joi.string().allow(''),
    complexity_level: Joi.number().min(1).max(5),
    customer_journey: Joi.string().allow(''),
    description: Joi.object().keys({
      problem: Joi.string().allow('').max(4095),
      says_who: Joi.string().allow('').max(4095),
      solution: Joi.string().allow('').max(4095),
      status: Joi.string().allow('').max(255),
    }),
    image_file: Joi.string().allow(''),
    journey_image_file: Joi.string().allow(''),
    analysis_image_file: Joi.string().allow(''),
    name: Joi.string().max(255),
    portfolio: Joi.object().keys({
      effort_estimation: Joi.number(),
      needs_addressed: Joi.number(),
      relevance: Joi.number(),
    }),
    skeleton: Joi.string().custom(jsonString),
    tags: Joi.array().items(
      Joi.object().keys({
        tag: Joi.string().required(),
        tagCategoryId: Joi.string().required().custom(slug),
        tagCategoryName: Joi.string().required(),
      })
    ),
    widget_config: Joi.string().custom(jsonString),
    autorun: Joi.boolean(),
    related_ea_components: Joi.string().allow(''),
    partner_logo: Joi.string().allow(''),
    // rated_by: Joi.object().pattern(
    //   /^[0-9a-fA-F]{24}$/,
    //   Joi.object()
    //     .required()
    //     .keys({
    //       rating: Joi.number().min(1).max(5),
    //     })
    // ),
  }),
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

// const getRecentPrototypes = {
//   query: Joi.object().keys({
//     userId: Joi.string().required(),
//   }),
// };

const deletePrototype = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  listPrototypes,
  createPrototype,
  getPrototype,
  updatePrototype,
  deletePrototype,
};

// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRelation = {
  body: Joi.object().keys({
    type: Joi.string().required().trim(),
    description: Joi.string().trim().allow(''),
    source: Joi.string().custom(objectId).required(),
    target: Joi.string().custom(objectId).required(),
    cardinality: Joi.string().valid('one-to-one', 'one-to-many', 'many-to-many'),
    properties: Joi.any(),
  }),
};

const getRelations = {
  query: Joi.object().keys({
    type: Joi.string(),
    source: Joi.string().custom(objectId),
    target: Joi.string().custom(objectId),
    cardinality: Joi.string().valid('one-to-one', 'one-to-many', 'many-to-many'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
  }),
};

const getRelation = {
  params: Joi.object().keys({
    relationId: Joi.string().custom(objectId).required(),
  }),
};

const updateRelation = {
  params: Joi.object().keys({
    relationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      // Only description, cardinality, properties are updatable
      description: Joi.string().trim().allow(''),
      cardinality: Joi.string().valid('one-to-one', 'one-to-many', 'many-to-many'),
      properties: Joi.any(),
    })
    .min(1),
};

const deleteRelation = {
  params: Joi.object().keys({
    relationId: Joi.string().custom(objectId).required(),
  }),
};

module.exports.createRelation = createRelation;
module.exports.getRelations = getRelations;
module.exports.getRelation = getRelation;
module.exports.updateRelation = updateRelation;
module.exports.deleteRelation = deleteRelation;

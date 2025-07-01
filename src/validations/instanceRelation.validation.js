// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createInstanceRelation = {
  body: Joi.object().keys({
    relation: Joi.string().custom(objectId).required(),
    source: Joi.string().custom(objectId).required(),
    target: Joi.string().custom(objectId).required(),
    metadata: Joi.any(),
  }),
};

const getInstanceRelations = {
  query: Joi.object().keys({
    relation: Joi.string().custom(objectId),
    source: Joi.string().custom(objectId),
    target: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInstanceRelation = {
  params: Joi.object().keys({
    instanceRelationId: Joi.string().custom(objectId).required(),
  }),
};

const updateInstanceRelation = {
  params: Joi.object().keys({
    instanceRelationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      // Only metadata should be updatable
      metadata: Joi.any().required(), // Require metadata if updating
    })
    .min(1),
};

const deleteInstanceRelation = {
  params: Joi.object().keys({
    instanceRelationId: Joi.string().custom(objectId).required(),
  }),
};

module.exports.createInstanceRelation = createInstanceRelation;
module.exports.getInstanceRelations = getInstanceRelations;
module.exports.getInstanceRelation = getInstanceRelation;
module.exports.updateInstanceRelation = updateInstanceRelation;
module.exports.deleteInstanceRelation = deleteInstanceRelation;

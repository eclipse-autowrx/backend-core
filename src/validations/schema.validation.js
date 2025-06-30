// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().allow(''),
    schema_definition: Joi.string().required(),
  }),
};

const getSchemas = {
  query: Joi.object().keys({
    name: Joi.string(),
    created_by: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
  }),
};

const getSchema = {
  params: Joi.object().keys({
    schemaId: Joi.string().custom(objectId).required(),
  }),
};

const updateSchema = {
  params: Joi.object().keys({
    schemaId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      description: Joi.string().trim().allow(''),
      schema_definition: Joi.string(),
    })
    .min(1), // Require at least one field to update
};

const deleteSchema = {
  params: Joi.object().keys({
    schemaId: Joi.string().custom(objectId).required(),
  }),
};

module.exports.createSchema = createSchema;
module.exports.getSchemas = getSchemas;
module.exports.getSchema = getSchema;
module.exports.updateSchema = updateSchema;
module.exports.deleteSchema = deleteSchema;

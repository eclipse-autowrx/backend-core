// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createInstance = {
  body: Joi.object().keys({
    schema: Joi.string().custom(objectId).required(),
    data: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

const getInstances = {
  query: Joi.object().keys({
    schema: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string(),
  }),
};

const getInstance = {
  params: Joi.object().keys({
    instanceId: Joi.string().custom(objectId).required(),
  }),
};

const updateInstance = {
  params: Joi.object().keys({
    instanceId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      data: Joi.string(),
      name: Joi.string(),
    })
    .min(1),
};

const deleteInstance = {
  params: Joi.object().keys({
    instanceId: Joi.string().custom(objectId).required(),
  }),
};

module.exports.createInstance = createInstance;
module.exports.getInstances = getInstances;
module.exports.getInstance = getInstance;
module.exports.updateInstance = updateInstance;
module.exports.deleteInstance = deleteInstance;

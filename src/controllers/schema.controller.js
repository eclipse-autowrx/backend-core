// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { schemaService } = require('../services');
const ApiError = require('../utils/ApiError');

const createSchema = catchAsync(async (req, res) => {
  const schema = await schemaService.createSchema(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(schema);
});

const getSchemas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'created_by']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const advanced = pick(req.query, ['search']);
  options.populate = ['created_by', 'name'];
  const result = await schemaService.querySchemas(filter, options, advanced);
  res.send(result);
});

const getSchema = catchAsync(async (req, res) => {
  const schema = await schemaService.getSchemaById(req.params.schemaId);
  res.send(schema);
});

const updateSchema = catchAsync(async (req, res) => {
  if (!(await schemaService.isOwner(req.params.schemaId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this schema');
  }
  const schema = await schemaService.updateSchemaById(req.params.schemaId, req.body);
  res.send(schema);
});

const deleteSchema = catchAsync(async (req, res) => {
  if (!(await schemaService.isOwner(req.params.schemaId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this schema');
  }
  await schemaService.deleteSchemaById(req.params.schemaId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports.createSchema = createSchema;
module.exports.getSchemas = getSchemas;
module.exports.getSchema = getSchema;
module.exports.updateSchema = updateSchema;
module.exports.deleteSchema = deleteSchema;

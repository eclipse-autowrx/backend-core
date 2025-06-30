// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { instanceRelationService } = require('../services');

const createInstanceRelation = catchAsync(async (req, res) => {
  const instanceRelation = await instanceRelationService.createInstanceRelation(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(instanceRelation);
});

const getInstanceRelations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['relation', 'source', 'target']); // Filter by relation, source instance, target instance
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await instanceRelationService.queryInstanceRelations(filter, options);
  res.send(result);
});

const getInstanceRelation = catchAsync(async (req, res) => {
  const instanceRelation = await instanceRelationService.getInstanceRelationById(req.params.instanceRelationId);
  res.send(instanceRelation);
});

const updateInstanceRelation = catchAsync(async (req, res) => {
  if (!(await instanceRelationService.isOwner(req.params.instanceRelationId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this instance relation');
  }
  const instanceRelation = await instanceRelationService.updateInstanceRelationById(req.params.instanceRelationId, req.body);
  res.send(instanceRelation);
});

const deleteInstanceRelation = catchAsync(async (req, res) => {
  if (!(await instanceRelationService.isOwner(req.params.instanceRelationId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this instance relation');
  }
  await instanceRelationService.deleteInstanceRelationById(req.params.instanceRelationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports.createInstanceRelation = createInstanceRelation;
module.exports.getInstanceRelations = getInstanceRelations;
module.exports.getInstanceRelation = getInstanceRelation;
module.exports.updateInstanceRelation = updateInstanceRelation;
module.exports.deleteInstanceRelation = deleteInstanceRelation;

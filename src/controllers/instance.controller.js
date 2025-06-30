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
const { instanceService } = require('../services');

const createInstance = catchAsync(async (req, res) => {
  const instance = await instanceService.createInstance(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(instance);
});

const getInstances = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['schema']); // Filter by schema ObjectId
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const advanced = pick(req.query, ['search']);
  const result = await instanceService.queryInstances(filter, options, advanced);
  res.send(result);
});

const getInstance = catchAsync(async (req, res) => {
  const instance = await instanceService.getInstanceById(req.params.instanceId);
  res.send(instance);
});

const updateInstance = catchAsync(async (req, res) => {
  if (!(await instanceService.isOwner(req.params.instanceId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this instance');
  }
  const instance = await instanceService.updateInstanceById(req.params.instanceId, req.body);
  res.send(instance);
});

const deleteInstance = catchAsync(async (req, res) => {
  if (!(await instanceService.isOwner(req.params.instanceId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this instance');
  }
  await instanceService.deleteInstanceById(req.params.instanceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports.createInstance = createInstance;
module.exports.getInstances = getInstances;
module.exports.getInstance = getInstance;
module.exports.updateInstance = updateInstance;
module.exports.deleteInstance = deleteInstance;

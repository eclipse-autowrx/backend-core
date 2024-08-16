const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { prototypeService, permissionService } = require('../services');
const pick = require('../utils/pick');
const { PERMISSIONS } = require('../config/roles');
const ApiError = require('../utils/ApiError');
const FeedbackPrototypeDecorator = require('../decorators/FeedbackPrototypeDecorator');

const createPrototype = catchAsync(async (req, res) => {
  if (!(await permissionService.hasPermission(req.user.id, PERMISSIONS.READ_MODEL, req.body.model_id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const prototypeId = await prototypeService.createPrototype(req.user.id, req.body);
  res.status(201).send(prototypeId);
});

const listPrototypes = catchAsync(async (req, res) => {
  const readableModelIds = await permissionService.listReadableModelIds(req.user?.id);

  const filter = pick(req.query, ['state', 'model_id', 'name', 'complexity_level', 'autorun', 'created_by']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'fields']);

  // Check if user has permission to view the model
  if (readableModelIds !== '*') {
    if (filter.model_id && !readableModelIds.includes(filter.model_id)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
    } else {
      filter.model_id = { $in: readableModelIds };
    }
  }

  const prototypes = await prototypeService.queryPrototypes(filter, {
    ...options,
    populate: ['created_by', 'name image_file'],
  });
  res.send(prototypes);
});

const getPrototype = catchAsync(async (req, res) => {
  const prototype = await prototypeService.getPrototypeById(req.params.id, req.user?.id);
  const finalResult = await new FeedbackPrototypeDecorator(prototype).getPrototype();
  res.send(finalResult);
});

const updatePrototype = catchAsync(async (req, res) => {
  const prototype = await prototypeService.updatePrototypeById(req.params.id, req.body, req.user.id);
  res.send(prototype);
});

const deletePrototype = catchAsync(async (req, res) => {
  await prototypeService.deletePrototypeById(req.params.id, req.user.id);
  res.status(204).send();
});

const listRecentPrototypes = catchAsync(async (req, res) => {
  const prototypes = await prototypeService.listRecentPrototypes(req.user.id);
  res.send(prototypes);
});

const executeCode = catchAsync(async (req, res) => {
  // Check if user has permission to view the prototype
  await prototypeService.getPrototypeById(req.params.id, req.user?.id);
  await prototypeService.executeCode(req.params.id, req.body);
  res.send('OK');
});

const listPopularPrototypes = catchAsync(async (req, res) => {
  const prototypes = await prototypeService.listPopularPrototypes(req.user.id);
  res.send(prototypes);
});

module.exports = {
  createPrototype,
  listPrototypes,
  getPrototype,
  updatePrototype,
  deletePrototype,
  listRecentPrototypes,
  listPopularPrototypes,
  executeCode,
};

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { prototypeService, permissionService } = require('../services');
const pick = require('../utils/pick');
const { PERMISSIONS, RESOURCE_TYPE } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const createPrototype = catchAsync(async (req, res) => {
  if (
    !(await permissionService.hasPermission(
      req.user.id,
      PERMISSIONS.CREATE_PROTOTYPE,
      RESOURCE_TYPE.MODEL,
      req.body.model_id
    ))
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const prototypeId = await prototypeService.createPrototype(req.user.id, req.body);
  res.status(201).send(prototypeId);
});

const listPrototypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state', 'model_id', 'name', 'complexity_level', 'autorun']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'fields']);
  const prototypes = await prototypeService.queryPrototypes(filter, options);
  res.send(prototypes);
});

const getPrototype = catchAsync(async (req, res) => {
  const prototype = await prototypeService.getPrototypeById(req.params.id, req.user?.id);
  res.send(prototype);
});

const updatePrototype = catchAsync(async (req, res) => {
  const prototype = await prototypeService.updatePrototypeById(req.params.id, req.body, req.user.id);
  res.send(prototype);
});

const deletePrototype = catchAsync(async (req, res) => {
  await prototypeService.deletePrototypeById(req.params.id, req.user.id);
  res.status(204).send();
});

module.exports = {
  createPrototype,
  listPrototypes,
  getPrototype,
  updatePrototype,
  deletePrototype,
};

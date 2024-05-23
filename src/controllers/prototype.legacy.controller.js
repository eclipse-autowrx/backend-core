const catchAsync = require('../utils/catchAsync');
const { prototypeLegacyService: prototypeService } = require('../services');
const pick = require('../utils/pick');

const listPrototypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state', 'model_id', 'fields']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await prototypeService.queryPrototypes(filter, options);
  res.send(result);
});

const updatePrototype = catchAsync(async (req, res) => {
  const { id } = req.params;
  const prototype = await prototypeService.updatePrototypeById(id, req.body);
  res.send(prototype);
});

const getRecentPrototypes = catchAsync(async (req, res) => {
  const prototypes = await prototypeService.getRecentPrototypes(req.query.userId);
  res.send(prototypes);
});

const createPrototype = catchAsync(async (req, res) => {
  const prototypeId = await prototypeService.createPrototype(req.body);
  res.status(201).send(prototypeId);
});

const deletePrototype = catchAsync(async (req, res) => {
  const { id } = req.params;
  await prototypeService.deletePrototypeById(id);
  res.status(204).send();
});

module.exports = {
  listPrototypes,
  updatePrototype,
  getRecentPrototypes,
  createPrototype,
  deletePrototype,
};

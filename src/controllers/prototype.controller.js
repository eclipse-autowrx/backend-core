const catchAsync = require('../utils/catchAsync');
const { prototypeService } = require('../services');
const pick = require('../utils/pick');

const createPrototype = catchAsync(async (req, res) => {
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
  const prototype = await prototypeService.getPrototypeById(req.params.id);
  res.send(prototype);
});

const updatePrototype = catchAsync(async (req, res) => {
  const prototype = await prototypeService.updatePrototypeById(req.params.id, req.body, req.user.id);
  res.send(prototype);
});

module.exports = {
  createPrototype,
  listPrototypes,
  getPrototype,
  updatePrototype,
};

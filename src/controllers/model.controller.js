const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { modelService } = require('../services');
const pick = require('../utils/pick');

const createModel = catchAsync(async (req, res) => {
  const model = await modelService.createModel(req.body);
  res.status(httpStatus.CREATED).send(model);
});

const getModel = catchAsync(async (req, res) => {
  const model = await modelService.getModelById(req.params.id);
  res.send(model);
});

const listModels = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'visibility', 'tenant_id', 'vehicle_category', 'main_api', 'id', 'fields']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await modelService.queryModels(filter, options);
  res.send(result);
});

const updateModel = catchAsync(async (req, res) => {
  const model = await modelService.updateModelById(req.params.id, req.body);
  res.send(model);
});

const updateTag = catchAsync(async (req, res) => {
  const model = await modelService.updateTag(req.params.id, req.body, req.query.rough);
  res.send(model);
});

const deleteApi = catchAsync(async (req, res) => {
  const result = await modelService.deleteApi(req.params.id, req.query.node_name);
  res.send(result);
});

module.exports = {
  createModel,
  getModel,
  listModels,
  updateModel,
  updateTag,
  deleteApi,
};

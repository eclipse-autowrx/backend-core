const httpStatus = require('http-status');
const { modelService, apiService, permissionService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createModel = catchAsync(async (req, res) => {
  const { cvi, custom_apis, ...reqBody } = req.body;
  const model = await modelService.createModel(req.user.id, {
    ...reqBody,
    ...(reqBody.custom_apis && { custom_apis: JSON.parse(reqBody.custom_apis) }),
  });
  await apiService.createApi({
    model: model._id,
    cvi: JSON.parse(cvi),
    created_by: req.user.id,
  });

  res.status(httpStatus.CREATED).send(model);
});

const listModels = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'visibility', 'tenant_id', 'vehicle_category', 'main_api', 'id', 'created_by']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate']);
  const advanced = pick(req.query, ['is_contributor']);
  const models = await modelService.queryModels(filter, options, advanced, req.user?.id);
  res.json(models);
});

const getModel = catchAsync(async (req, res) => {
  const model = await modelService.getModelById(req.params.id, req.user?.id);
  if (!model) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Model not found');
  }
  const contributors = await permissionService.listAuthorizedUser({
    role: 'model_contributor',
    ref: req.params.id,
  });
  const members = await permissionService.listAuthorizedUser({
    role: 'model_member',
    ref: req.params.id,
  });

  const finalResult = {
    ...model.toJSON(),
    contributors,
    members,
  };

  res.send(finalResult);
});

const updateModel = catchAsync(async (req, res) => {
  const model = await modelService.updateModelById(
    req.params.id,
    {
      ...req.body,
      ...(req.body.custom_apis && { custom_apis: JSON.parse(req.body.custom_apis) }),
    },
    req.user.id
  );
  res.send(model);
});

const deleteModel = catchAsync(async (req, res) => {
  await modelService.deleteModelById(req.params.id, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const addAuthorizedUser = catchAsync(async (req, res) => {
  await modelService.addAuthorizedUser(req.params.id, req.body, req.user.id);
  res.status(httpStatus.CREATED).send();
});

const deleteAuthorizedUser = catchAsync(async (req, res) => {
  await modelService.deleteAuthorizedUser(
    req.params.id,
    {
      role: req.query.role,
      userId: req.query.userId,
    },
    req.user.id
  );
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createModel,
  listModels,
  getModel,
  updateModel,
  deleteModel,
  addAuthorizedUser,
  deleteAuthorizedUser,
};

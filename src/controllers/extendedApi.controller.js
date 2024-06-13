const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { extendedApiService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createExtendedApi = catchAsync(async (req, res) => {
  const extendedApi = await extendedApiService.createExtendedApi(req.body);
  res.status(httpStatus.CREATED).send(extendedApi);
});

const getExtendedApis = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['apiName', 'model', 'skeleton']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await extendedApiService.queryExtendedApis(filter, options);
  res.send(result);
});

const getExtendedApi = catchAsync(async (req, res) => {
  const extendedApi = await extendedApiService.getExtendedApiById(req.params.id);
  if (!extendedApi) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExtendedApi not found');
  }
  res.send(extendedApi);
});

const updateExtendedApi = catchAsync(async (req, res) => {
  const extendedApi = await extendedApiService.updateExtendedApiById(req.params.id, req.body);
  res.send(extendedApi);
});

const deleteExtendedApi = catchAsync(async (req, res) => {
  await extendedApiService.deleteExtendedApiById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createExtendedApi,
  getExtendedApis,
  getExtendedApi,
  updateExtendedApi,
  deleteExtendedApi,
};

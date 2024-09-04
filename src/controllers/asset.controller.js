const httpStatus = require('http-status');
const { assetService, tokenService, permissionService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { PERMISSIONS } = require('../config/roles');

const createAsset = catchAsync(async (req, res) => {
  const asset = await assetService.createAsset({
    ...req.body,
    created_by: req.user.id,
  });
  res.send(asset);
});

const getAssets = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filter = pick(req.query, ['name', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const isAdmin = await permissionService.hasPermission(userId, PERMISSIONS.ADMIN);
  if (!isAdmin) {
    filter.created_by = userId;
  }

  const result = await assetService.queryAssets(filter, options);
  res.send(result);
});

const getAsset = catchAsync(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  res.send(asset);
});

const updateAsset = catchAsync(async (req, res) => {
  const asset = await assetService.updateAsset(req.params.id, req.body);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  res.status(200).send();
});

const deleteAsset = catchAsync(async (req, res) => {
  const asset = await assetService.deleteAsset(req.params.id);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  res.status(200).send();
});

const generateToken = catchAsync(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  const tokens = await tokenService.generateAuthTokens(asset);
  delete tokens.refresh;
  res.send({ tokens });
});

const addAuthorizedUser = catchAsync(async (req, res) => {
  const userIds = req.body.userId.split(',');
  const promises = userIds.map((userId) => assetService.addAuthorizedUser(req.params.id, { userId, role: req.body.role }));
  await Promise.all(promises).catch((err) => {
    throw new ApiError(httpStatus.BAD_REQUEST, err.message);
  });
  res.status(httpStatus.CREATED).send();
});

module.exports = {
  createAsset,
  getAssets,
  updateAsset,
  getAsset,
  deleteAsset,
  generateToken,
  addAuthorizedUser,
};

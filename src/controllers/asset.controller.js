const httpStatus = require('http-status');
const { assetService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

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
  const result = await assetService.queryAssets(
    {
      ...filter,
      created_by: userId,
    },
    options
  );
  res.send(result);
});

const getAsset = catchAsync(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.assetId);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  res.send(asset);
});

const updateAsset = catchAsync(async (req, res) => {
  const asset = await assetService.updateAsset(req.params.assetId, req.body);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  res.status(200).send();
});

const deleteAsset = catchAsync(async (req, res) => {
  const asset = await assetService.deleteAsset(req.params.assetId);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  res.status(200).send();
});

const generateToken = catchAsync(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.assetId);
  if (!asset) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
  }
  const tokens = await tokenService.generateAuthTokens(asset);
  delete tokens.refresh;
  res.send({ tokens });
});

module.exports = {
  createAsset,
  getAssets,
  updateAsset,
  getAsset,
  deleteAsset,
  generateToken,
};

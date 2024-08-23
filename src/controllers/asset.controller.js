const { assetService } = require('../services');
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

module.exports = {
  createAsset,
  getAssets,
};

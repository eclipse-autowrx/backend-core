const httpStatus = require('http-status');
const { searchService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const search = catchAsync(async (req, res) => {
  const { q } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await searchService.search(q, options, req.user?.id);
  res.send(result);
});

const searchUserByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await searchService.searchUserByEmail(email);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(result);
});

module.exports = { search, searchUserByEmail };

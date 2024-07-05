const { searchService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const search = catchAsync(async (req, res) => {
  const { q } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await searchService.search(q, options, req.user.id);
  res.send(result);
});

module.exports = { search };

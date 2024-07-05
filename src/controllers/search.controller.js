const { searchService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const search = catchAsync(async (req, res) => {
  const { q } = req.query;
  const result = await searchService.search(q);
  res.send(result);
});

module.exports = { search };

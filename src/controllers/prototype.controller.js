const catchAsync = require('../utils/catchAsync');
const { prototypeService } = require('../services');
const pick = require('../utils/pick');

const listPrototypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['state', 'model_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await prototypeService.queryPrototypes(filter, options);
  res.send(result);
});

module.exports = {
  listPrototypes,
};

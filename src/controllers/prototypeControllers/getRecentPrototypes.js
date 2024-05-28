const prototypeService = require('../../services/prototype.service');
const catchAsync = require('../../utils/catchAsync');

const getRecentPrototypes = catchAsync(async (req, res) => {
  const prototypes = await prototypeService.getRecentPrototypes(req.params.userId);
  res.send(prototypes);
});

module.exports = { getRecentPrototypes };

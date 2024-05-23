const catchAsync = require('../utils/catchAsync');
const { prototypeLegacyService: prototypeService } = require('../services');

const createPrototype = catchAsync(async (req, res) => {
  const prototypeId = await prototypeService.createPrototype(req.body);
  res.status(201).send(prototypeId);
});

module.exports = {
  createPrototype,
};

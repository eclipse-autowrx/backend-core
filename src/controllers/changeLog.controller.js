const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { changeLogService } = require('../services');
const pick = require('../utils/pick');

const listChangeLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ref_type', 'ref', 'created_by', 'action']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const changeLogs = await changeLogService.listChangeLogs(filter, options);
  res.status(httpStatus.OK).json(changeLogs);
});

module.exports.listChangeLogs = listChangeLogs;

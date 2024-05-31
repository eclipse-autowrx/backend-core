const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { discussionService } = require('../services');
const pick = require('../utils/pick');

const createDiscussion = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const discussion = await discussionService.createDiscussion({
    ...req.body,
    created_by: userId,
  });
  res.status(httpStatus.CREATED).send(discussion);
});

const listDiscussions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ref', 'ref_type', 'id', 'parent']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'fields', 'populate']);
  const discussions = await discussionService.queryDiscussions(filter, options);
  res.send(discussions);
});

module.exports = {
  createDiscussion,
  listDiscussions,
};

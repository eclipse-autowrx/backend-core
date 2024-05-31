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
  const discussions = await discussionService.queryDiscussions(
    {
      ...filter,
      parent: { $exists: false },
    },
    options
  );
  // TODO: Optimize the code below
  const promises = [];
  for (let i = 0; i < discussions.results.length; i += 1) {
    discussions.results[i] = discussions.results[i].toJSON();
    const discussion = discussions.results[i];
    promises.push(
      (async () => {
        const list = await discussionService.listDiscussions({ parent: discussion.id });
        // eslint-disable-next-line no-param-reassign
        discussion.replies = list;
      })()
    );
  }
  await Promise.all(promises);

  res.send(discussions);
});

module.exports = {
  createDiscussion,
  listDiscussions,
};

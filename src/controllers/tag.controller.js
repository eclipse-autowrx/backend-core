const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { tagService } = require('../services');

const listTagCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['tenantId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tagService.queryTagCategories(filter, options);
  res.send(result);
});

const createTag = catchAsync(async (req, res) => {
  const tagId = await tagService.createTag(req.body);
  res.status(201).send(tagId);
});

const updateTagCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;
  const result = await tagService.updateTagCategory(id, tags);
  res.send(result);
});

const createTagCategory = catchAsync(async (req, res) => {
  const result = await tagService.createTagCategory(req.body);
  res.status(201).send(result);
});

module.exports = {
  listTagCategories,
  createTag,
  updateTagCategory,
  createTagCategory,
};

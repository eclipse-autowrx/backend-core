/* eslint-disable security/detect-non-literal-regexp */
const mongoose = require('mongoose');
const { modelService } = require('.');
const { Prototype, User } = require('../models');

const search = async (query, options, userId) => {
  const accessibleModels = await modelService.getAccessibleModels(userId);

  const models = await modelService.queryModels(
    { $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] },
    {},
    {},
    userId
  );
  const prototypes = await Prototype.paginate(
    {
      $and: [
        { $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] },
        {
          model_id: { $in: accessibleModels.map((model) => new mongoose.Types.ObjectId(model._id || model.id)) },
        },
      ],
    },
    options
  );

  return {
    prototypes: prototypes.results,
    models: models.results,
    page: prototypes.page,
    limit: prototypes.limit,
    totalPages: Math.max(prototypes.totalPages, models.totalPages),
    totalResults: prototypes.totalResults + models.totalResults,
  };
};

const searchUserByEmail = async (email) => {
  return User.findOne({
    email,
  }).select('email name image_file');
};

module.exports = { search, searchUserByEmail };

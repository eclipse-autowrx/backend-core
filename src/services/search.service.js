/* eslint-disable security/detect-non-literal-regexp */
const mongoose = require('mongoose');
const { modelService } = require('.');
const { Prototype } = require('../models');

const search = async (query, options, userId) => {
  const models = await modelService.queryModels(
    { $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] },
    { limit: 10000 },
    {},
    userId
  );
  const prototypes = await Prototype.paginate(
    {
      $and: [
        { $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }] },
        {
          model_id: { $in: models.results.map((model) => new mongoose.Types.ObjectId(model.id)) },
        },
      ],
    },
    options
  );

  const modelLength = models.results.length || 0;
  const modelTotalPages = Math.ceil(modelLength / (options.limit <= 0 ? 10 : options.limit));

  return {
    prototypes: prototypes.results,
    models: models.results,
    page: prototypes.page,
    limit: prototypes.limit,
    totalPages: Math.max(prototypes.totalPages, modelTotalPages),
    totalResults: prototypes.totalResults + models.totalResults,
  };
};

module.exports = { search };

/* eslint-disable security/detect-non-literal-regexp */
const { Prototype, Model } = require('../models');

const search = async (query, options) => {
  const [prototypes, models] = await Promise.all([
    Prototype.paginate(
      {
        $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }],
      },
      options
    ),
    Model.paginate(
      {
        $or: [{ name: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }],
      },
      options
    ),
  ]);

  return {
    prototypes: prototypes.results,
    models: models.results,
    page: prototypes.page,
    limit: prototypes.limit,
    totalPages: Math.max(prototypes.totalPages, models.totalPages),
    totalResults: prototypes.totalResults + models.totalResults,
  };
};

module.exports = { search };

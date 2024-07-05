const { Prototype, Model } = require('../models');

const search = async (query) => {
  const prototypes = Prototype.find({
    $or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }],
  });
  const models = Model.find({
    $or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }],
  });
  return { prototypes, models };
};

module.exports = { search };

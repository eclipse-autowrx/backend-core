const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema(
  {
    tagCategoryId: String,
    tagCategoryName: String,
    tag: String,
  },
  {
    _id: false,
  }
);

const extendedApiSchema = mongoose.Schema(
  {
    apiName: {
      type: String,
      required: true,
    },
    model: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Model',
      required: true,
    },
    skeleton: {
      type: String,
    },
    tags: [tagSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
extendedApiSchema.plugin(toJSON);
extendedApiSchema.plugin(paginate);

extendedApiSchema.index({ apiName: 1, model: 1 }, { unique: true });

/**
 * @typedef ExtendedApi
 */
const ExtendedApi = mongoose.model('ExtendedApi', extendedApiSchema);

module.exports = ExtendedApi;

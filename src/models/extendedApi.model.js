const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
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
    type: {
      type: String,
    },
    datatype: {
      type: String,
    },
    description: String,
    tags: [tagSchema],
    isWishlist: {
      type: Boolean,
      default: false
    }
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

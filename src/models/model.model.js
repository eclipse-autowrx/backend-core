const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { visibilityTypes } = require('../config/visibility');

const modelSchema = mongoose.Schema(
  {
    custom_apis: {
      type: Map,
    },
    cvi: {
      type: String,
      required: true,
    },
    main_api: {
      type: String,
      required: true,
      trim: true,
    },
    model_home_image_file: {
      type: String,
    },
    model_files: {
      type: Map,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    visibility: {
      type: String,
      required: true,
      enums: Object.values(visibilityTypes),
    },
    tenant_id: {
      type: String,
      required: true,
      trim: true,
    },
    vehicle_category: {
      type: String,
      required: true,
      trim: true,
    },
    property: {
      type: String,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    skeleton: {
      type: String,
    },
    tags: {
      type: [Map],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
modelSchema.plugin(toJSON);

/**
 * @typedef Model
 */
const Model = mongoose.model('Model', modelSchema);

module.exports = Model;

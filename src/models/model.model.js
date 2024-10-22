const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { visibilityTypes } = require('../config/enums');

const tagSchema = mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
    },
    tagCategoryId: {
      type: String,
      required: true,
    },
    tagCategoryName: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const modelSchema = mongoose.Schema(
  {
    custom_apis: {
      type: Object,
    },
    main_api: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    model_home_image_file: {
      type: String,
    },
    model_files: {
      type: Object,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    visibility: {
      type: String,
      required: true,
      enums: Object.values(visibilityTypes),
    },
    vehicle_category: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    property: {
      type: String,
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    skeleton: {
      type: String,
    },
    tags: {
      type: [tagSchema],
    },
    extend: {
      type: mongoose.SchemaTypes.Mixed,
    },
    api_version: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
modelSchema.plugin(toJSON);
modelSchema.plugin(paginate);

/**
 * @typedef Model
 */
const Model = mongoose.model('Model', modelSchema);

module.exports = Model;

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const scoreSchema = mongoose.Schema(
  {
    easy_to_use: {
      type: Number,
      min: 1,
      max: 5,
    },
    need_address: {
      type: Number,
      min: 1,
      max: 5,
    },
    relevance: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    _id: false,
  }
);

const feedbackSchema = mongoose.Schema(
  {
    avg_score: {
      type: Number,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
      maxLength: 2000,
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    ref: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    ref_type: {
      type: String,
      required: true,
    },
    model_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Model',
    },
    question: {
      type: String,
      maxLength: 2000,
    },
    recommendation: {
      type: String,
      maxLength: 2000,
    },
    score: {
      type: scoreSchema,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
feedbackSchema.plugin(toJSON);
feedbackSchema.plugin(paginate);

/**
 * @typedef {Object} Score
 * @property {number} [easy_to_use]
 * @property {number} [need_address]
 * @property {number} [relevance]
 */

/**
 * @typedef {Object} Feedback
 * @property {number} [avg_score]
 * @property {string} [description]
 * @property {ObjectId} created_by
 * @property {ObjectId} ref
 * @property {string} ref_type
 * @property {ObjectId} [model_id]
 * @property {string} [question]
 * @property {recommendation} [recommendation]
 * @property {Score} [score]
 */
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

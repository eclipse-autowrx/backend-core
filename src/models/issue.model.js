const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const issueSchema = mongoose.Schema(
  {
    extendedApi: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ExtendedApi',
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
issueSchema.plugin(toJSON);
issueSchema.plugin(paginate);

/**
 * @typedef Issue
 */
const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;

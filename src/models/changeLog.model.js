const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const changeLogSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
    },
    ref_type: {
      type: String,
      required: true,
    },
    ref: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE'],
      required: true,
    },
    changes: {
      type: mongoose.SchemaTypes.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

changeLogSchema.plugin(toJSON);
changeLogSchema.plugin(paginate);

const ChangeLog = mongoose.model('ChangeLog', changeLogSchema);

module.exports = ChangeLog;

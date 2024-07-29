const mongoose = require('mongoose');
const { ROLES_ENUM } = require('../config/roles');
const { toJSON } = require('./plugins');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: {
    type: [String],
    required: true,
    default: [],
    enums: ROLES_ENUM,
  },
  ref: String,
  not_feature: Boolean,
});

roleSchema.plugin(toJSON);

module.exports = mongoose.model('Role', roleSchema);

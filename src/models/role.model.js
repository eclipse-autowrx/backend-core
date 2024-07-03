const mongoose = require('mongoose');
const { ROLES_ENUM } = require('../config/roles');
const { toJSON } = require('./plugins');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: {
    type: [String],
    required: true,
    default: [],
    enums: ROLES_ENUM,
  },
});

roleSchema.plugin(toJSON);

module.exports = mongoose.model('Role', roleSchema);

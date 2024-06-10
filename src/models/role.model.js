const mongoose = require('mongoose');
const { ROLES_ENUM } = require('../config/roles');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: {
    type: [String],
    required: true,
    default: [],
    enums: ROLES_ENUM,
  },
});

module.exports = mongoose.model('Role', roleSchema);

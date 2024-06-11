const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  ref: { type: mongoose.Schema.Types.ObjectId },
});

userRoleSchema.index({ user: 1, role: 1, ref: 1, refType: 1 }, { unique: true });

userRoleSchema.statics.checkExist = async function (user, role, ref, refType) {
  return this.findOne({ user, role, ref, refType });
};

module.exports = mongoose.model('UserRole', userRoleSchema);

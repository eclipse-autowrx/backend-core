const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userInfo = mongoose.Schema(
  {
    email: String,
    providerId: String,
  },
  {
    _id: false,
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    image_file: {
      type: String,
      required: false,
      trim: true,
    },
    provider: {
      type: String,
      default: 'Email',
      trim: true,
    },
    uid: {
      type: String,
    },
    provider_data: {
      type: [userInfo],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef {Object} UserRoles
 * @property {string[]} model_contributor - List of model contributors
 * @property {string[]} tenant_admin - List of tenant admins
 * @property {string[]} model_member - List of model members
 */

/**
 * @typedef {Object} UserInfo
 * @property {string} email - The email of the user
 * @property {string} providerId - The provider ID of the user
 */

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} role
 * @property {UserRoles} roles
 * @property {boolean} email_verified
 * @property {string} [image_file]
 * @property {string} provider
 * @property {string} uid
 * @property {UserInfo[]} provider_data
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const User = mongoose.model('User', userSchema);

module.exports = User;

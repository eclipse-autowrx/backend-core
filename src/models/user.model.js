const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { timestamp } = require('./utils.model');

const rolesSchema = mongoose.Schema(
  {
    model_contributor: {
      type: [String],
      default: [],
    },
    tenant_admin: {
      type: [String],
      default: [],
    },
    model_member: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const userInfo = mongoose.Schema({
  email: String,
  providerId: String,
});

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
    roles: {
      type: rolesSchema,
      default: {
        model_contributor: [],
        tenant_admin: [],
        model_member: [],
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isSystemAdmin: {
      type: Boolean,
      default: false,
    },
    tenant_id: {
      type: String,
      required: true,
      trim: true,
    },
    image_file: {
      type: String,
      required: false,
      trim: true,
    },
    created_time: {
      type: timestamp,
      default: {
        _seconds: Math.floor(Date.now() / 1000),
        _nanoseconds: 0,
      },
    },
    provider: {
      type: String,
      default: 'Email',
      trim: true,
    },
    uid: {
      type: String,
    },
    providerData: {
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
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;

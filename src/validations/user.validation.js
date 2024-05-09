const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const rolesSchema = Joi.object().keys({
  model_contributor: Joi.array().items(Joi.string()).default([]),
  tenant_admin: Joi.array().items(Joi.string()).default([]),
  model_member: Joi.array().items(Joi.string()).default([]),
});

const userInfo = Joi.object({
  email: Joi.string().email(),
  providerId: Joi.string(),
});

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid('user', 'admin'),
    roles: rolesSchema,
    emailVerified: Joi.boolean().default(false),
    isSystemAdmin: Joi.boolean().default(false),
    tenant_id: Joi.string().required().trim(),
    provider: Joi.string().required().trim().default('email'),
    image_file: Joi.string().optional().trim(),
    created_time: Joi.object()
      .keys({
        _seconds: Joi.number().required(),
        _nanoseconds: Joi.number().required(),
      })
      .default({
        _seconds: Math.floor(Date.now() / 1000),
        _nanoseconds: 0,
      }),
    uid: Joi.string().optional(),
    providerData: Joi.array().items(userInfo),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const updateSelfUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string(),
      isEmailVerified: Joi.boolean(),
      tenant_id: Joi.string(),
      image_file: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateSelfUser,
  updateUser,
  deleteUser,
};

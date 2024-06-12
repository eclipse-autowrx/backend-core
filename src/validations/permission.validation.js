const Joi = require('joi');

const assignRoleToUser = {
  body: Joi.object().keys({
    user: Joi.string().required(), // Assuming this is a user ID
    role: Joi.string().required(), // Assuming this is a role ID
    ref: Joi.string().required(), // Assuming this is a reference ID
    refType: Joi.string().required(), // Assuming this is a reference type string
  }),
};

const getUserRoles = {
  params: Joi.object().keys({
    user: Joi.string().required(), // Assuming this is a user ID
  }),
};

const getRoleUsers = {
  params: Joi.object().keys({
    role: Joi.string().required(), // Assuming this is a role ID
  }),
};

const getSelfUsers = {
  query: Joi.object().keys({
    permission: Joi.string(),
  }),
};

const getPermission = {
  query: Joi.object().keys({
    permissions: Joi.string(),
  }),
};

module.exports = {
  assignRoleToUser,
  getUserRoles,
  getRoleUsers,
  getSelfUsers,
  getPermission,
};

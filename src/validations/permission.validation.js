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
    ref: Joi.string(),
    refType: Joi.string(),
  }),
};

module.exports = {
  assignRoleToUser,
  getUserRoles,
  getRoleUsers,
  getSelfUsers,
};

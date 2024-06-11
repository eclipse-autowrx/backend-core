const permissionService = require('../services/permission.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const assignRoleToUser = catchAsync(async (req, res) => {
  const { user, role, ref, refType } = req.body;
  const userRole = await permissionService.assignRoleToUser(user, role, ref, refType);
  res.status(201).json(userRole);
});

const getUserRoles = catchAsync(async (req, res) => {
  const roles = await permissionService.getUserRoles(req.params.user);
  res.json(roles);
});

const getSelfRoles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ref', 'refType']);
  const roles = await permissionService.getUserRoles(req.user.id, filter);
  res.json(roles);
});

const getRoleUsers = catchAsync(async (req, res) => {
  const users = await permissionService.getRoleUsers(req.params.role);
  res.json(users);
});

module.exports = {
  assignRoleToUser,
  getUserRoles,
  getRoleUsers,
  getSelfRoles,
};

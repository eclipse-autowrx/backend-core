const allRoles = {
  user: ['getUsers'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const PERMISSIONS = {
  CREATE_UNLIMITED_MODEL: 'createUnlimitedModel',
  VIEW_MODEL: 'viewModel',
  UPDATE_MODEL: 'updateModel',
  CREATE_PROTOTYPE: 'createPrototype',
  VIEW_PROTOTYPE: 'viewPrototype',
  UPDATE_PROTOTYPE: 'updatePrototype',
  MANAGE_USERS: 'manageUsers',
};

// The role here is applied for the resources that the user is not the owner of
const ROLES = {
  promoted_user: {
    permissions: [PERMISSIONS.CREATE_UNLIMITED_MODEL],
  },
  model_contributor: {
    permissions: [PERMISSIONS.VIEW_MODEL, PERMISSIONS.CREATE_PROTOTYPE, PERMISSIONS.VIEW_PROTOTYPE],
  },
  model_member: {
    permissions: [
      PERMISSIONS.VIEW_MODEL,
      PERMISSIONS.UPDATE_MODEL,
      PERMISSIONS.CREATE_PROTOTYPE,
      PERMISSIONS.VIEW_PROTOTYPE,
      PERMISSIONS.UPDATE_PROTOTYPE,
    ],
  },
  admin: {
    permissions: [
      PERMISSIONS.VIEW_MODEL,
      PERMISSIONS.UPDATE_MODEL,
      PERMISSIONS.CREATE_PROTOTYPE,
      PERMISSIONS.VIEW_PROTOTYPE,
      PERMISSIONS.UPDATE_PROTOTYPE,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.CREATE_UNLIMITED_MODEL,
    ],
  },
};

module.exports = {
  roles,
  roleRights,
  ROLES,
  PERMISSIONS,
};

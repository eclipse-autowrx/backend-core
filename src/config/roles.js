const allRoles = {
  user: ['getUsers'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const PERMISSIONS = {
  // *
  UNLIMITED_MODEL: 'unlimitedModel',
  MANAGE_USERS: 'manageUsers',

  // model_id
  READ_MODEL: 'readModel',
  WRITE_MODEL: 'writeModel',
};

// The role here is applied for the resources that the user is not the owner of
const ROLES = {
  promoted_user: {
    permissions: [PERMISSIONS.UNLIMITED_MODEL],
  },
  model_contributor: {
    permissions: [PERMISSIONS.READ_MODEL],
  },
  model_member: {
    permissions: [PERMISSIONS.READ_MODEL, PERMISSIONS.WRITE_MODEL],
  },
  admin: {
    permissions: [PERMISSIONS.READ_MODEL, PERMISSIONS.WRITE_MODEL, PERMISSIONS.MANAGE_USERS, PERMISSIONS.UNLIMITED_MODEL],
  },
};

module.exports = {
  roles,
  roleRights,
  ROLES,
  PERMISSIONS,
};

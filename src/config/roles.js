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

  // genai,
  GENERATIVE_AI: 'generativeAI',
};

const PERMISSIONS_DESCRIPTION = {
  [PERMISSIONS.UNLIMITED_MODEL]: 'Unlimited access',
  [PERMISSIONS.MANAGE_USERS]: 'Manage users',
  [PERMISSIONS.READ_MODEL]: 'Read model',
  [PERMISSIONS.WRITE_MODEL]: 'Write model',
  [PERMISSIONS.GENERATIVE_AI]: 'Generative AI',
};

// The role here is applied for the resources that the user is not the owner of
const ROLES = {
  promoted_user: {
    permissions: [PERMISSIONS.UNLIMITED_MODEL],
    ref: 'promoted_user',
    name: 'Unlimited model',
  },
  generative_ai_role: {
    permissions: [PERMISSIONS.GENERATIVE_AI],
    ref: 'generative_ai_role',
    name: 'Generative AI',
  },
  model_contributor: {
    permissions: [PERMISSIONS.READ_MODEL],
    ref: 'model_contributor',
    name: 'Model contributor',
    not_feature: true,
  },
  model_member: {
    permissions: [PERMISSIONS.READ_MODEL, PERMISSIONS.WRITE_MODEL],
    ref: 'model_member',
    name: 'Model member',
    not_feature: true,
  },
  admin: {
    permissions: [
      PERMISSIONS.READ_MODEL,
      PERMISSIONS.WRITE_MODEL,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.UNLIMITED_MODEL,
      PERMISSIONS.GENERATIVE_AI,
    ],
    ref: 'admin',
    name: 'Admin',
  },
};

module.exports = {
  roles,
  roleRights,
  ROLES,
  PERMISSIONS,
  PERMISSIONS_DESCRIPTION,
};

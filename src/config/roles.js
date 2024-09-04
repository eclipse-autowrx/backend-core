const allRoles = {
  user: ['getUsers'],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const PERMISSIONS = {
  // *
  UNLIMITED_MODEL: 'unlimitedModel',
  ADMIN: 'manageUsers',

  // model_id
  READ_MODEL: 'readModel',
  WRITE_MODEL: 'writeModel',

  // genai,
  GENERATIVE_AI: 'generativeAI',

  // read assets,
  READ_ASSET: 'readAsset',
  WRITE_ASSET: 'writeAsset',
};

const PERMISSIONS_DESCRIPTION = {
  [PERMISSIONS.UNLIMITED_MODEL]: 'Unlimited access',
  [PERMISSIONS.ADMIN]: 'Manage users',
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
      PERMISSIONS.ADMIN,
      PERMISSIONS.UNLIMITED_MODEL,
      PERMISSIONS.GENERATIVE_AI,
      PERMISSIONS.READ_ASSET,
      PERMISSIONS.WRITE_ASSET,
    ],
    ref: 'admin',
    name: 'Admin',
  },
  read_asset: {
    permissions: [PERMISSIONS.READ_ASSET],
    ref: 'read_asset',
    name: 'Read asset',
  },
  write_asset: {
    permissions: [PERMISSIONS.READ_ASSET, PERMISSIONS.WRITE_ASSET],
    ref: 'write_asset',
    name: 'Write asset',
  },
};

const RESOURCES = {
  MODEL: 'model',
  PROTOTYPE: 'prototype',
  ASSET: 'asset',
};

module.exports = {
  roles,
  roleRights,
  ROLES,
  PERMISSIONS,
  PERMISSIONS_DESCRIPTION,
  RESOURCES,
};

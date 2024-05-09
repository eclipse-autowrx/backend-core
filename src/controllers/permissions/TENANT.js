const { hasRole } = require('./utils');

const TENANT = (profile) => {
  return {
    canRead() {
      return true;
    },
    canEdit() {
      if (profile === null) {
        return false;
      }
      return hasRole(profile, 'tenant_admin', process.env.TENANT_ID || '');
    },
  };
};

module.exports = {
  TENANT,
};

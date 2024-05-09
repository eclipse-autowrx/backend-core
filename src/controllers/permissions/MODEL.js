const { hasRole } = require('./utils');

const MODEL = (profile, model) => {
  return {
    canRead() {
      if (!model) return false;
      if (profile && model && model.created && profile.uid === model.created.user_uid) {
        return true;
      }
      if ((model.visibility ?? 'public') === 'public') {
        return true;
      }
      if (profile === null) {
        return false;
      }
      return (
        hasRole(profile, 'model_member', model.id) ||
        hasRole(profile, 'model_contributor', model.id) ||
        hasRole(profile, 'tenant_admin', process.env.TENANT_ID || '')
      );
    },
    canEdit() {
      if (profile === null) {
        return false;
      }
      if (profile && model && model.created && profile.uid === model.created.user_uid) {
        return true;
      }
      // Tenant Admins need to add themselves as model contributor before they're allowed to edit.
      return hasRole(profile, 'model_contributor', model.id);
    },
    isOwner() {
      if (profile === null) {
        return false;
      }
      if (profile && model && model.created && profile.uid === model.created.user_uid) {
        return true;
      }
      return false;
    },
  };
};

module.exports = {
  MODEL,
};

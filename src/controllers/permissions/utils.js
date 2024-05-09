const { db } = require('../../config/firebase');

const hasRole = (profile, role, object_id) => {
  return (profile.roles[role] ?? []).includes(object_id) ?? false;
};

const getSingleUserProfile = async (uid) => {
  const userDoc = await db.collection('user').doc(uid).get();
  return userDoc.data();
};

module.exports = {
  hasRole,
  getSingleUserProfile,
};

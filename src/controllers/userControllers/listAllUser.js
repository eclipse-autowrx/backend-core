const { auth, db } = require('../../config/firebase');
const permissions = require('../permissions');
const { TENANT_ID } = require('../permissions');

const getSingleUserProfile = async (uid) => {
  const userDoc = await db.collection('user').doc(uid).get();
  return userDoc.data();
};

const listAllUser = async (req, res) => {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const profile = await getSingleUserProfile(decodedToken.uid);

    if (!permissions.TENANT(profile).canEdit()) {
      throw new Error('You must be a tenant admin to list users.');
    }

    const retUsers = [];

    const users = await db.collection('user').where('tenant_id', '==', TENANT_ID).get();

    if (!users.empty) {
      users.forEach((user) => {
        retUsers.push({ id: user.id, ...user.data() });
      });
    }

    res.status(200).json(retUsers);
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

module.exports = {
  listAllUser,
};

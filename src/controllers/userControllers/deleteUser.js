const { auth, db } = require('../../config/firebase');
const permissions = require('../permissions');

// Helper function to get a single user profile from Firebase
const getSingleUserProfile = async (uid) => {
  return (await db.collection('user').doc(uid).get()).data();
};

// Controller function to delete a user
const deleteUser = async (req, res) => {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const profile = await getSingleUserProfile(decodedToken.uid);
    if (!permissions.TENANT(profile).canEdit()) {
      return res.status(403).send('You must be a tenant admin to delete users.');
    }

    const { uid } = req.query; // or req.body if parameters are in the body

    if (!uid) {
      return res.status(400).send('uid is required');
    }

    const querySnapshot = await db.collection('user').where('uid', '==', uid).limit(1).get();
    if (querySnapshot.empty) {
      return res.status(404).send('uid not found');
    }

    const userDoc = querySnapshot.docs[0];
    await userDoc.ref.delete();
    await auth.deleteUser(uid);

    return res.status(200).send('Delete done!');
  } catch (error) {
    return res.status(400).send(error.toString());
  }
};

module.exports = { deleteUser };

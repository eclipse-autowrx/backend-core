const { auth, db } = require('../../config/firebase');
const permissions = require('../permissions');

// Helper function to get user profile from Firebase
const getSingleUserProfile = async (uid) => {
  return (await db.collection('user').doc(uid).get()).data();
};

// Controller function to update a user
const updateUser = async (req, res) => {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const profile = await getSingleUserProfile(decodedToken.uid);
    if (!permissions.TENANT(profile).canEdit()) {
      return res.status(403).send('You must be a tenant admin to create users.');
    }

    const { name, email, image_file, uid } = req.query; // or req.body if parameters are in the body

    if (!uid) {
      return res.status(400).send('uid is required');
    }

    const queries = await db.collection('user').where('uid', '==', uid).limit(1).get();
    if (queries.empty) {
      return res.status(404).send('uid not found');
    }
    const user = queries.docs[0];
    const userData = user.data();
    userData.name = name || userData.name;
    userData.email = email || userData.email;
    userData.image_file = image_file || userData.image_file;

    await user.ref.update(userData);

    res.status(200).send('Update success!');
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

module.exports = { updateUser };

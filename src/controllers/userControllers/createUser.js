const { randomUUID } = require('crypto');
const { Timestamp } = require('firebase-admin/firestore');
const { Buffer } = require('buffer');
const { auth, db } = require('../../config/firebase');
const permissions = require('../permissions');

// Helper function to get a single user profile from Firebase
const getSingleUserProfile = async (uid) => {
  return (await db.collection('user').doc(uid).get()).data();
};

// Controller function to create a user
const createUser = async (req, res) => {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const profile = await getSingleUserProfile(decodedToken.uid);
    if (!permissions.TENANT(profile).canEdit()) {
      throw new Error('You must be a tenant admin to create users.');
    }

    const { name, email, image_file } = req.query; // Or req.body if parameters are in the body

    const password = Buffer.from(randomUUID()).toString('base64').slice(0, 16);

    const userRecord = await auth.createUser({
      email,
      emailVerified: true,
      password,
    });

    await db
      .collection('user')
      .doc(userRecord.uid)
      .set({
        tenant_id: permissions.TENANT_ID,
        uid: userRecord.uid,
        roles: {},
        name: name ?? '',
        email,
        image_file: image_file ?? '',
        created_time: Timestamp.now(),
      });

    res.status(200).send({
      email,
      password,
    });
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

module.exports = { createUser };

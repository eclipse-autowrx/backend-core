const httpStatus = require('http-status');
const { auth, db } = require('../../config/firebase');
const permissions = require('../permissions');
const ApiError = require('../../utils/ApiError');

// Helper function to get user profile from Firebase
async function getSingleUserProfile(uid) {
  return (await db.collection('user').doc(uid).get()).data();
}

// Controller for updating a feature
async function updateFeature(req, res) {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const profile = await getSingleUserProfile(decodedToken.uid);
    if (!permissions.TENANT(profile).canEdit()) {
      throw new Error('You must be a tenant admin to create users.');
    }

    if (req.method !== 'PUT' || !req.body) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const { id, uids } = req.body;

    if (!id || !Array.isArray(uids)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    await db.collection('feature').doc(id).update({ uids });

    res.status(200).send('Update success!');
  } catch (error) {
    res.status(400).send(error.toString());
  }
}

// Endpoint mapping
module.exports = {
  updateFeature,
};

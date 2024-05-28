const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { auth, db } = require('../../config/firebase');

const getSingleUserProfile = async (uid) => {
  const userDoc = await db.collection('user').doc(uid).get();
  return userDoc.data();
};

const listAllFeature = async (req, res) => {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    // eslint-disable-next-line no-unused-vars
    const profile = await getSingleUserProfile(decodedToken.uid);

    // You can enable this if permissions are required
    // if (!permissions.TENANT(profile).canEdit()) {
    //   throw new Error('You must be a tenant admin to do this action.');
    // }

    if (req.method !== 'GET') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const dbFeatures = [];
    const existFeaturesObj = await db.collection('feature').get();

    if (existFeaturesObj && !existFeaturesObj.empty) {
      existFeaturesObj.forEach((feature) => {
        const f = {
          id: feature.id,
          ...feature.data(),
        };
        dbFeatures.push(f);
      });
    }

    res.status(200).json(dbFeatures);
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

module.exports = {
  listAllFeature,
};

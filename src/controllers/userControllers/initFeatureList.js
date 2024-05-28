const { Timestamp } = require('firebase-admin/firestore');
const httpStatus = require('http-status');
const { auth } = require('../../config/firebase');
const { db } = require('../../models/token.model');
const ApiError = require('../../utils/ApiError');
const { TENANT_ID } = require('../permissions');
const permissions = require('../permissions');

const getSingleUserProfile = async (uid) => {
  const userDoc = await db.collection('user').doc(uid).get();
  return userDoc.data();
};

const initFeatureList = async (req, res) => {
  const idToken = req.headers['x-id-token'] ?? '';
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const profile = await getSingleUserProfile(decodedToken.uid);

    if (!permissions.TENANT(profile).canEdit()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You must be a tenant admin to do this action.');
    }

    if (req.method !== 'POST' || !req.body) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const { features } = req.body;

    if (!features || !Array.isArray(features) || features.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const dbFeatures = [];
    const existingFeaturesObj = await db.collection('feature').where('tenant_id', '==', TENANT_ID).get();
    if (existingFeaturesObj && !existingFeaturesObj.empty) {
      existingFeaturesObj.forEach((feature) => {
        const f = {
          id: feature.id,
          ...feature.data(),
        };
        dbFeatures.push(f);
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const newFeature of features) {
      const existingFeature = dbFeatures.find((f) => f.name === newFeature.name);
      if (!existingFeature) {
        // eslint-disable-next-line no-await-in-loop
        await db.collection('feature').add({
          ...newFeature,
          tenant_id: TENANT_ID,
          created_time: Timestamp.now(),
        });
      }
    }

    res.status(httpStatus.OK).send('Successful!');
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.toString());
  }
};

module.exports = {
  initFeatureList,
};

const { Timestamp } = require('firebase-admin/firestore');
const { db } = require('../../config/firebase');
const { TENANT_ID } = require('../permissions');

// Controller function to create a user or check if one exists based on provider
const createUserByProvider = async (req, res) => {
  try {
    const { name, email, image_file, uid, provider } = req.query; // or req.body for POST requests

    const user = await db.collection('user').doc(uid).get();
    if (user.exists) {
      // Return if user already exists
      return res.status(200).send({
        existed: true,
        email: user.data()?.email,
        name: user.data()?.name,
      });
    }

    // Create new user document in Firestore
    await db
      .collection('user')
      .doc(uid)
      .set({
        tenant_id: TENANT_ID,
        uid,
        roles: {},
        name: name || email,
        email,
        image_file: image_file || '',
        provider: provider || 'email', // Default to 'email' if no provider specified
        created_time: Timestamp.now(),
      });

    // Respond with new user details
    return res.status(200).send({
      existed: false,
      email,
      name,
    });
  } catch (error) {
    return res.status(400).send(error.toString());
  }
};

module.exports = { createUserByProvider };

const { Timestamp } = require('firebase-admin/firestore');
const { db } = require('../../config/firebase');
const { TENANT_ID } = require('../permissions/index');

const createUserByProvider = async (req, res) => {
  try {
    const { name, email, image_file, uid, provider } = req.body;

    // Validate UID
    if (!uid || typeof uid !== 'string' || uid.trim() === '') {
      return res.status(400).json({ error: 'UID is required and must be a non-empty string.' });
    }

    const user = await db.collection('user').doc(uid).get();
    if (user.exists) {
      return res.status(200).json({
        existed: true,
        email: user.data()?.email,
        name: user.data()?.name,
      });
    }

    await db
      .collection('user')
      .doc(uid)
      .set({
        tenant_id: TENANT_ID,
        uid,
        roles: {},
        name: (name || email) ?? '',
        email,
        image_file: image_file ?? '',
        provider: provider ?? '',
        created_time: Timestamp.now(),
      });

    res.status(200).json({
      existed: false,
      email,
      name,
    });
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
};

module.exports = {
  createUserByProvider,
};

const { db } = require('../../config/firebase');
const { TENANT_ID } = require('../permissions');

const listAllUserBasic = async (req, res) => {
  try {
    const retUsers = [];

    const users = await db.collection('user').where('tenant_id', '==', TENANT_ID).get();

    if (!users.empty) {
      users.forEach((user) => {
        retUsers.push({
          id: user.id,
          uid: user.data().uid,
          email: user.data().email,
          name: user.data().name,
          provider: user.data().provider,
          image_file: user.data().image_file,
          created_time: user.data().created_time,
        });
      });
    }

    res.status(200).json(retUsers);
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

module.exports = {
  listAllUserBasic,
};

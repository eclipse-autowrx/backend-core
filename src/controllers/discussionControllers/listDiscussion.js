const httpStatus = require('http-status');
const { db } = require('../../config/firebase');

const listDiscussion = async (req, res) => {
  try {
    const { masterIds } = req.query;

    if (!masterIds) {
      res.status(httpStatus.BAD_REQUEST).send('Missing masterIds');
      return;
    }

    const dbDiscussions = await db.collection('discussion').where('master_id', 'in', masterIds.split(',')).get();

    if (dbDiscussions.empty) {
      res.status(httpStatus.OK).json([]);
      return;
    }

    const discussions = dbDiscussions.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const listOfUID = discussions.map((discussion) => discussion.created?.user_uid || null);
    const uniqueUIDs = [...new Set(listOfUID.filter((uid) => uid !== null))];

    if (uniqueUIDs.length > 0) {
      const users = await db.collection('user').where('uid', 'in', uniqueUIDs).get();
      users.docs.forEach((docUser) => {
        discussions.forEach((discussion) => {
          if (discussion.created && discussion.created.user_uid === docUser.id) {
            // eslint-disable-next-line no-param-reassign
            discussion.created.user_fullname = docUser.data()?.name || '';
            // eslint-disable-next-line no-param-reassign
            discussion.created.user_avatar = docUser.data()?.image_file || '';
          }
        });
      });
    }

    res.status(httpStatus.OK).json(discussions);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('BE: error on list discussion', error);
    res.status(httpStatus.BAD_REQUEST).send(error.toString());
  }
};

module.exports = {
  listDiscussion,
};

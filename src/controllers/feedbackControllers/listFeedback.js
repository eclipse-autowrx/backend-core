const httpStatus = require('http-status');
const { db } = require('../../config/firebase');

const listFeedback = async (req, res) => {
  try {
    const { masterType, masterId } = req.query;

    if (!masterType || !masterId) {
      res.status(httpStatus.BAD_REQUEST).json({
        message: 'Missing type or refId',
      });
      return;
    }

    const dbFeedbacks = await db
      .collection('feedback')
      .where('master_type', '==', masterType)
      .where('master_id', 'in', masterId.split(','))
      .get();

    if (dbFeedbacks.empty) {
      res.status(httpStatus.OK).json([]);
      return;
    }

    const feedbacks = dbFeedbacks.docs.map((fb) => ({
      id: fb.id,
      ...fb.data(),
    }));

    const listOfUID = feedbacks.map((feedback) => feedback.created?.user_uid || null);
    const uniqueUIDs = [...new Set(listOfUID.filter((uid) => uid !== null))];

    if (uniqueUIDs.length > 0) {
      const users = await db.collection('user').where('uid', 'in', uniqueUIDs).get();
      users.docs.forEach((docUser) => {
        const usrName = docUser.data()?.name || '';
        feedbacks.forEach((feedback) => {
          if (feedback.created && feedback.created.user_uid === docUser.id) {
            // eslint-disable-next-line no-param-reassign
            feedback.created.user_fullname = usrName;
          }
        });
      });
    }

    res.status(httpStatus.OK).json(feedbacks);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error listing feedbacks:', error);
    res.status(httpStatus.BAD_REQUEST).send(error.toString());
  }
};

module.exports = {
  listFeedback,
};

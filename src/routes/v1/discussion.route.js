const express = require('express');
const { Timestamp } = require('firebase-admin/firestore');
const { listDiscussion } = require('../../controllers/discussionControllers/listDiscussion');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/listDiscussion', listDiscussion);
router.post('/', async (req, res) => {
  try {
    const newDiscussionRef = db.collection('discussion').doc();
    const { userId, ...reqBody } = req.body;
    const data = {
      ...reqBody,
      id: newDiscussionRef.id,
      created: {
        created_time: Timestamp.now(),
        user_uid: userId,
      },
    };
    const response = await newDiscussionRef.set(data);
    res.send(response);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

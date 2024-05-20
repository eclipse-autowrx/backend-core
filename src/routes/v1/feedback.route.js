const express = require('express');
const { Timestamp } = require('firebase-admin/firestore');
const { listFeedback } = require('../../controllers/feedbackControllers/listFeedback');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/listFeedback', listFeedback);
router.post('/', async (req, res) => {
  try {
    const newFeedbackRef = db.collection('feedback').doc();
    const { userId, ...reqBody } = req.body;
    const data = {
      ...reqBody,
      id: newFeedbackRef.id,
      created: {
        created_time: Timestamp.now(),
        user_uid: userId,
      },
    };
    const response = await newFeedbackRef.set(data);
    res.send(response);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

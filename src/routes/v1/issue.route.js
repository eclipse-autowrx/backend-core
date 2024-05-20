const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await db.collection('issue').get();
    const issues = [];
    response.forEach((doc) => {
      issues.push(doc.data());
    });
    res.send(issues);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

function filterUndefinedFields(data) {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await db.collection('issue').doc(id).get();
    const result = response.data();
    res.send(result);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = filterUndefinedFields(req.body);

    if (Object.keys(data).length === 0) {
      res.send('no data to update');
      return;
    }

    const response = await db.collection('issue').doc(id).update(data);

    res.send(response);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.post('/', async (req, res) => {
  try {
    const docRef = db.collection('issue').doc();
    const response = await docRef.set({
      ...req.body,
      id: docRef.id,
      timestamp: {
        created_time: Timestamp.now(),
        lastUpdated_time: Timestamp.now(),
      },
    });
    res.send(response);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

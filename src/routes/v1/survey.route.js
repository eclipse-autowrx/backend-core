const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await db.collection('survey').get();
    const result = response.docs.map((doc) => doc.data());
    res.send(result);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await db.collection('survey').doc(id).get();
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
    const docSnap = await db.collection('survey').doc(id).get();
    let response = null;

    if (docSnap.exists) {
      response = await db.collection('survey').doc(id).update(req.body);
    } else {
      response = await db.collection('survey').doc(id).set(req.body);
    }
    res.send(response);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.post('/', async (req, res) => {
  try {
    const docRef = db.collection('survey').doc();
    const response = await docRef.set({
      ...req.body,
      id: docRef.id,
    });
    res.send(response);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

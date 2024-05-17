const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.post('/createAddOn', async (req, res) => {
  try {
    const docRef = db.collection('addOns').doc();
    const data = req.body;
    data.id = docRef.id;
    data.createdBy = req.body.userId;
    data.createdAt = Timestamp.now();
    await docRef.set(data);
    res.send(docRef.id);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.get('/getAddOns', async (req, res) => {
  try {
    const { model_id } = req.query;
    const addOns = [];
    const snapshot = await db.collection('addOns').where('model_id', '==', model_id).get();
    snapshot.forEach((doc) => {
      addOns.push(doc.data());
    });

    res.send(addOns);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.put('/updateAddOn/:addOnId', async (req, res) => {
  try {
    const { addOnId } = req.params;

    const data = req.body;
    const addOnRef = db.collection('addOns').doc(addOnId);
    await addOnRef.update(data);
    res.send('success');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.delete('/deleteAddOn/:addOnId', async (req, res) => {
  try {
    const { addOnId } = req.params;
    const addOnRef = db.collection('addOns').doc(addOnId);
    await addOnRef.delete();
    res.send('success');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

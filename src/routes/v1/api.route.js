const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = db.collection('api');
    Object.keys(req.query).forEach((key) => {
      query = query.where(key, '==', req.query[key]);
    });
    const api = [];
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      api.push(doc.data());
    });
    res.send(api);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.post('/', async (req, res) => {
  try {
    const api = req.body;
    await db.collection('api').doc().set(api);
    res.send('Created');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const api = req.body;
    await db.collection('api').doc(req.params.id).set(api);
    res.send('Updated');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

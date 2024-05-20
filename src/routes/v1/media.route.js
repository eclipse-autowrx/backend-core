const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const result = await db.collection('media').doc(tenantId).get();
    if (!result.exists) {
      return [];
    }
    const { media } = result.data();

    res.send(Object.values(media).sort((a, b) => (a.filename > b.filename ? 1 : -1)));
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.post('/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { media } = req.body;
    const currMedia = (await db.collection('media').doc(tenantId).get()).data() || {};
    currMedia.media = { ...currMedia?.media, ...JSON.parse(media) };

    console.log('currMedia', currMedia.media);

    await db.collection('media').doc(tenantId).set({
      media: currMedia.media,
    });
    res.send('success');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.delete('/:tenantId/:filename', async (req, res) => {
  try {
    const { tenantId, filename } = req.params;
    const currMedia = (await db.collection('media').doc(tenantId).get()).data();
    delete currMedia?.media[filename];
    await db.collection('media').doc(tenantId).set({
      media: currMedia?.media,
    });
    res.send('success');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

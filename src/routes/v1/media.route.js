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

module.exports = router;

const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/categories/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const response = await db.collection('tags').where('tenant_id', '==', tenantId).get();
    const result = response.docs.map((doc) => doc.data());
    res.send(result);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;

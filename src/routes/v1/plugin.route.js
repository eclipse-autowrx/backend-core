const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let ret = [];
    const model_ids = req.query.model_ids?.split(',');
    const { model_id, prototype_id } = req.query;

    if (model_ids) {
      const numOfCall = Math.ceil(model_ids.length / 30);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < numOfCall; i++) {
        // eslint-disable-next-line no-await-in-loop
        const subRet = await db
          .collection('plugin')
          .where('model_id', 'in', model_ids.slice(i * 30, Math.min((i + 1) * 30, model_ids.length)))
          .get();
        ret = ret.concat(subRet.docs.map((doc) => doc.data()));
      }
    } else {
      let baseQuery = db.collection('plugin');

      if (model_id) {
        baseQuery = baseQuery.where('model_id', '==', model_id);
      }
      if (prototype_id) {
        baseQuery = baseQuery.where('prototype_id', '==', prototype_id);
      }

      const response = await baseQuery.get();
      response.forEach((doc) => ret.push(doc.data()));
    }
    res.send(ret);
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

router.get('/', async (req, res) => {
  const { model_id } = req.query; // Assuming model_id is sent in the body of the POST request

  try {
    const response = await db.collection('project').where('model_id', '==', model_id).get();
    res.send(response.docs.map((doc) => doc.data()));
  } catch (error) {
    res.status(400).json({ error: String(error) });
  }
});

module.exports = router;

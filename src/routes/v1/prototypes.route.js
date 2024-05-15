const express = require('express');
const { listReleasedPrototypes } = require('../../controllers/prototypeControllers/listReleasedPrototypes');
const { updatePrototypeUsedAPIs } = require('../../controllers/prototypeControllers/updatePrototypeUsedAPIs');
const { listAllPrototypes } = require('../../controllers/prototypeControllers/listAllPrototypes');
const { getRecentPrototypes } = require('../../controllers/prototypeControllers/getRecentPrototypes');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/listReleasedPrototypes', listReleasedPrototypes);
router.get('/listAllPrototypes', listAllPrototypes);
router.post('/updatePrototypeUsedAPIs', updatePrototypeUsedAPIs);
router.get('/recentPrototypes/:userId', getRecentPrototypes);
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

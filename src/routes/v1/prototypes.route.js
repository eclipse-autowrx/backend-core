const express = require('express');
const { listReleasedPrototypes } = require('../../controllers/prototypeControllers/listReleasedPrototypes');
const { updatePrototypeUsedAPIs } = require('../../controllers/prototypeControllers/updatePrototypeUsedAPIs');
const { listAllPrototypes } = require('../../controllers/prototypeControllers/listAllPrototypes');
const { getRecentPrototypes } = require('../../controllers/prototypeControllers/getRecentPrototypes');

const router = express.Router();

router.get('/listReleasedPrototypes', listReleasedPrototypes);
router.get('/listAllPrototypes', listAllPrototypes);
router.post('/updatePrototypeUsedAPIs', updatePrototypeUsedAPIs);
router.get('/recentPrototypes/:userId', getRecentPrototypes);

module.exports = router;

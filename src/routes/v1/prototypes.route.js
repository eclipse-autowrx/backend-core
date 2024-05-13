const express = require('express');
const { listReleasedPrototypes } = require('../../controllers/prototypeControllers/listReleasedPrototypes');
const { updatePrototypeUsedAPIs } = require('../../controllers/prototypeControllers/updatePrototypeUsedAPIs');

const router = express.Router();

router.get('/listReleasedPrototypes', listReleasedPrototypes);
router.post('/updatePrototypeUsedAPIs', updatePrototypeUsedAPIs);

module.exports = router;

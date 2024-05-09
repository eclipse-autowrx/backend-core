const express = require('express');
const { listReleasedPrototypes } = require('../../controllers/prototypeControllers/listReleasedPrototypes');

const router = express.Router();

router.get('/listReleasedPrototypes', listReleasedPrototypes);

module.exports = router;

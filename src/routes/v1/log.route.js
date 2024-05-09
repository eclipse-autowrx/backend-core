const express = require('express');

const router = express.Router();

const { listActivityLog } = require('../../controllers/logControllers/listActivityLog');

router.get('/listActivityLog', listActivityLog);

module.exports = router;

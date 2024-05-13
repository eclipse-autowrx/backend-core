const express = require('express');

const router = express.Router();

const { listFeedback } = require('../../controllers/feedbackControllers/listFeedback');

router.get('/listFeedback', listFeedback);

module.exports = router;

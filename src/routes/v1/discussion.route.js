const express = require('express');

const router = express.Router();

const { listDiscussion } = require('../../controllers/discussionControllers/listDiscussion');

router.get('/listDiscussion', listDiscussion);

module.exports = router;

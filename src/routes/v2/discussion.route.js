const express = require('express');
const validate = require('../../middlewares/validate');
const { discussionValidation } = require('../../validations');
const { discussionController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(discussionValidation.createDiscussion), discussionController.createDiscussion)
  .get(validate(discussionValidation.listDiscussions), discussionController.listDiscussions);

module.exports = router;

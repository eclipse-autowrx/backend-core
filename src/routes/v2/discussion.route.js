const express = require('express');
const validate = require('../../middlewares/validate');
const { discussionValidation } = require('../../validations');
const { discussionController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const config = require('../../config/config');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(discussionValidation.createDiscussion), discussionController.createDiscussion)
  .get(
    auth({
      optional: !config.strictAuth,
    }),
    validate(discussionValidation.listDiscussions),
    discussionController.listDiscussions
  );

router
  .route('/:id')
  .patch(auth(), validate(discussionValidation.updateDiscussion), discussionController.updateDiscussion)
  .delete(auth(), validate(discussionValidation.deleteDiscussion), discussionController.deleteDiscussion);

module.exports = router;

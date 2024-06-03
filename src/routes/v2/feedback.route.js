const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { feedbackValidation } = require('../../validations');
const { feedbackController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(feedbackValidation.createFeedback), feedbackController.createFeedback)
  .get(validate(feedbackValidation.listFeedbacks), feedbackController.listFeedbacks);

router
  .route('/:id')
  .patch(auth(), validate(feedbackValidation.updateFeedback), feedbackController.updateFeedback)
  .delete(auth(), validate(feedbackValidation.deleteFeedback), feedbackController.deleteFeedback);

module.exports = router;

const express = require('express');
const validate = require('../../middlewares/validate');
const modelValidation = require('../../validations/model.validation');
const { modelController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(modelValidation.createModel), modelController.createModel)
  .get(validate(modelValidation.listModels), modelController.listModels);

router
  .route('/:id')
  .get(validate(modelValidation.getModel), modelController.getModel)
  .patch(auth(), validate(modelValidation.updateModel), modelController.updateModel)
  .delete(auth(), validate(modelValidation.deleteModel), modelController.deleteModel);

module.exports = router;

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { apiController } = require('../../controllers');
const { apiValidation } = require('../../validations');

const router = express.Router();

router.route('/').post(auth(), validate(apiValidation.createApi), apiController.createApi);
router
  .route('/:id')
  .get(validate(apiValidation.getApi), apiController.getApi)
  .patch(auth(), validate(apiValidation.updateApi), apiController.updateApi)
  .delete(auth(), validate(apiValidation.deleteApi), apiController.deleteApi);
router.route('/model_id/:modelId').get(validate(apiValidation.getApiByModelId), apiController.getApiByModelId);

module.exports = router;

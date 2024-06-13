const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const extendedApiValidation = require('../../validations/extendedApi.validation');
const extendedApiController = require('../../controllers/extendedApi.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(extendedApiValidation.createExtendedApi), extendedApiController.createExtendedApi)
  .get(validate(extendedApiValidation.getExtendedApis), extendedApiController.getExtendedApis);

router
  .route('/:id')
  .get(validate(extendedApiValidation.getExtendedApi), extendedApiController.getExtendedApi)
  .patch(auth(), validate(extendedApiValidation.updateExtendedApi), extendedApiController.updateExtendedApi)
  .delete(auth(), validate(extendedApiValidation.deleteExtendedApi), extendedApiController.deleteExtendedApi);

module.exports = router;

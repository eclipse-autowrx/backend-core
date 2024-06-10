const express = require('express');
const validate = require('../../middlewares/validate');
const modelValidation = require('../../validations/model.validation');
const { modelController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const { checkPermission } = require('../../middlewares/permission');
const { PERMISSIONS, RESOURCE_TYPE } = require('../../config/roles');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(modelValidation.createModel), modelController.createModel)
  .get(
    auth({
      optional: true,
    }),
    validate(modelValidation.listModels),
    modelController.listModels
  );

router
  .route('/:id')
  .get(
    auth({
      optional: true,
    }),
    validate(modelValidation.getModel),
    modelController.getModel
  )
  .patch(
    auth(),
    checkPermission(PERMISSIONS.UPDATE_MODEL, RESOURCE_TYPE.MODEL),
    validate(modelValidation.updateModel),
    modelController.updateModel
  )
  .delete(
    auth(),
    checkPermission(PERMISSIONS.UPDATE_MODEL, RESOURCE_TYPE.MODEL),
    validate(modelValidation.deleteModel),
    modelController.deleteModel
  );

router
  .route('/:id/permissions')
  .post(auth(), validate(modelValidation.addAuthorizedUser), modelController.addAuthorizedUser);

module.exports = router;

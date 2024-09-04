const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { assetValidation } = require('../../validations');
const { assetController } = require('../../controllers');
const { checkPermission } = require('../../middlewares/permission');
const { PERMISSIONS, RESOURCES } = require('../../config/roles');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(assetValidation.createAsset), assetController.createAsset)
  .get(auth(), validate(assetValidation.getAssets), assetController.getAssets);

router
  .route('/:id')
  .get(
    auth(),
    checkPermission(PERMISSIONS.READ_ASSET, RESOURCES.ASSET),
    validate(assetValidation.getAsset),
    assetController.getAsset
  )
  .patch(
    auth(),
    checkPermission(PERMISSIONS.WRITE_ASSET, RESOURCES.ASSET),
    validate(assetValidation.updateAsset),
    assetController.updateAsset
  )
  .delete(
    auth(),
    checkPermission(PERMISSIONS.WRITE_ASSET, RESOURCES.ASSET),
    validate(assetValidation.deleteAsset),
    assetController.deleteAsset
  );

router
  .route('/:id/generate-token')
  .post(
    auth(),
    checkPermission(PERMISSIONS.READ_ASSET, RESOURCES.ASSET),
    validate(assetValidation.generateToken),
    assetController.generateToken
  );

router
  .route('/:id/permissions')
  .post(
    auth(),
    checkPermission(PERMISSIONS.WRITE_ASSET, RESOURCES.ASSET),
    validate(assetValidation.addAuthorizedUser),
    assetController.addAuthorizedUser
  );

module.exports = router;

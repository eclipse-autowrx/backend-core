const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { assetValidation } = require('../../validations');
const { assetController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(assetValidation.createAsset), assetController.createAsset)
  .get(auth(), validate(assetValidation.getAssets), assetController.getAssets);

router
  .route('/:assetId')
  .get(auth(), validate(assetValidation.getAsset), assetController.getAsset)
  .patch(auth(), validate(assetValidation.updateAsset), assetController.updateAsset)
  .delete(auth(), validate(assetValidation.deleteAsset), assetController.deleteAsset);

router
  .route('/:assetId/generate-token')
  .post(auth(), validate(assetValidation.generateToken), assetController.generateToken);

module.exports = router;

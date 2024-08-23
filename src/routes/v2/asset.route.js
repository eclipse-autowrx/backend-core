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

module.exports = router;

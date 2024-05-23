const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { prototypeValidation } = require('../../validations');
const { prototypeController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(prototypeValidation.createPrototype), prototypeController.createPrototype)
  .get(validate(prototypeValidation.listPrototypes), prototypeController.listPrototypes);

router
  .route('/:id')
  .get(validate(prototypeValidation.getPrototype), prototypeController.getPrototype)
  .patch(auth(), validate(prototypeValidation.updatePrototype), prototypeController.updatePrototype);

module.exports = router;

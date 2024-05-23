const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { prototypeValidation } = require('../../validations');
const { prototypeController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth(), validate(prototypeValidation.createPrototype), prototypeController.createPrototype);

module.exports = router;

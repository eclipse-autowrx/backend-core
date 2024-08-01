const express = require('express');
const validate = require('../../middlewares/validate');
const { certivityValidation } = require('../../validations');
const { certivityController } = require('../../controllers');

const router = express.Router();

router.route('/regulations').get(validate(certivityValidation.getRegulations), certivityController.getRegulations);

module.exports = router;

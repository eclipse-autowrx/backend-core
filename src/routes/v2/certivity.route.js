const express = require('express');
const validate = require('../../middlewares/validate');
const { certivityValidation } = require('../../validations');
const { certivityController } = require('../../controllers');
const config = require('../../config/config');

const router = express.Router();

router.route('/regulations').get(
  auth({
    optional: !config.strictAuth,
  }),
  validate(certivityValidation.getRegulations),
  certivityController.getRegulations
);

module.exports = router;

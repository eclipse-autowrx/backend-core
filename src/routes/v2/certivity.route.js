const express = require('express');
const validate = require('../../middlewares/validate');
const { certivityValidation } = require('../../validations');
const { certivityController } = require('../../controllers');
const config = require('../../config/config');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/regulations').get(
  auth({
    optional: !config.strictAuth,
  }),
  validate(certivityValidation.getRegulations),
  certivityController.getRegulations
);

module.exports = router;

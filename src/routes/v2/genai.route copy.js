// const axios = require('axios');
const express = require('express');
const auth = require('../../middlewares/auth');
const { genaiController } = require('../../controllers');
const genaiPermission = require('../../middlewares/genaiPermission');
const config = require('../../config/config');

const router = express.Router();

router.post(
  '/etas',
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.generateAIContent
);

router.put(
  '/etas/profiles/:profileId',
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.updateProfile
);

router.post(
  '/etas/:environment',
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.generateAIContent
);

router.put(
  '/etas/:environment/profiles/:profileId',
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.updateProfile
);

module.exports = router;

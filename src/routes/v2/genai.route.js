// const axios = require('axios');
const express = require('express');
const auth = require('../../middlewares/auth');
const { invokeBedrockModel } = require('../../controllers/genai.controller');
const { genaiController } = require('../../controllers');
const genaiPermission = require('../../middlewares/genaiPermission');
const config = require('../../config/config');

const router = express.Router();

router.post(
  '/',
  // validate(genaiValidation.invokeBedrock),
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  invokeBedrockModel
);

router.post(
  '/openai',
  // validate(genaiValidation.invokeOpenAI),
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.invokeOpenAIController
);

router.post(
  '/etas',
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.generateAIContent
);

router.post(
  '/etas/:environment',
  auth({
    optional: !config.strictAuth,
  }),
  genaiPermission,
  genaiController.generateAIContent
);

module.exports = router;

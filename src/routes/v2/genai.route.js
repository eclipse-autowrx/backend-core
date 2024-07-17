// const axios = require('axios');
const express = require('express');
const auth = require('../../middlewares/auth');
const { invokeBedrockModel } = require('../../controllers/genai.controller');
const { genaiController } = require('../../controllers');
const genaiPermission = require('../../middlewares/genaiPermission');

const router = express.Router();

router.post(
  '/',
  // validate(genaiValidation.invokeBedrock),
  auth({
    optional: true,
  }),
  genaiPermission,
  invokeBedrockModel
);

router.post(
  '/openai',
  // validate(genaiValidation.invokeOpenAI),
  auth({
    optional: true,
  }),
  genaiPermission,
  genaiController.invokeOpenAIController
);

router.post(
  '/etas',
  auth({
    optional: true,
  }),
  genaiPermission,
  genaiController.generateAIContent
);

module.exports = router;

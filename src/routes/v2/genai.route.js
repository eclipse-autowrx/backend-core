// const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { auth: firebaseAuth } = require('../../config/firebase');
const auth = require('../../middlewares/auth');
const { permissionService } = require('../../services');
const { PERMISSIONS } = require('../../config/roles');
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');
const { invokeBedrockModel } = require('../../controllers/genai.controller');
const { genaiController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const { genaiValidation } = require('../../validations');

const router = express.Router();

const hasGenAIPermission = async (userId) => {
  if (!userId) {
    return false;
  }

  if (mongoose.Types.ObjectId.isValid(userId)) {
    try {
      return await permissionService.hasPermission(userId, PERMISSIONS.GENERATIVE_AI);
    } catch (error) {
      return false;
    }
  }

  try {
    const record = (await firebaseAuth.getUser(userId)).toJSON();

    if (
      record &&
      [
        'nhan.luongnguyen@vn.bosch.com',
        'phong.phamtuan@vn.bosch.com',
        'tam.thaihoangminh@vn.bosch.com',
        'hoang.phanthanh@vn.bosch.com',
        'dirk.slama@bosch.com',
        'thanh.hoang.bk@gmail.com',
        'tuan.hoangdinhanh@vn.bosch.com',
        'hdatdragon2@gmail.com',
      ].includes(record.email)
    ) {
      return true;
    }
  } catch (error) {
    logger.error(error);
    return false;
  }
  return false;
};

router.post(
  '/',
  validate(genaiValidation.invokeBedrock),
  auth({
    optional: true,
  }),
  // eslint-disable-next-line no-unused-vars
  async (req, _, next) => {
    const { user } = req.body;
    if (!(await hasGenAIPermission(user || req.user?.id))) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to use GenAI service'));
    }
    next();
  },
  invokeBedrockModel
);

router.post(
  '/openai',
  validate(genaiValidation.invokeOpenAI),
  auth({
    optional: true,
  }),
  // eslint-disable-next-line no-unused-vars
  async (req, _, next) => {
    const { user } = req.body;
    if (!(await hasGenAIPermission(user || req.user?.id))) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to use GenAI service'));
    }
    next();
  },
  genaiController.invokeOpenAIController
);

module.exports = router;

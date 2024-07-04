// const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { auth: firebaseAuth } = require('../../config/firebase');
const auth = require('../../middlewares/auth');
const { permissionService } = require('../../services');
const { PERMISSIONS } = require('../../config/roles');
const ApiError = require('../../utils/ApiError');
// const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');
const { invokeBedrockModel } = require('../../controllers/genai.controller');

const router = express.Router();

// const getAccessToken = async () => {
//   const params = new URLSearchParams();
//   params.append('grant_type', 'client_credentials');
//   params.append('client_id', process.env.ETAS_CLIENT_ID || '');
//   params.append('client_secret', process.env.ETAS_CLIENT_SECRET || '');
//   params.append('scope', process.env.ETAS_SCOPE || '');

//   console.log('ETAS_CLIENT_ID', process.env.ETAS_CLIENT_ID);
//   console.log('ETAS_CLIENT_SECRET', process.env.ETAS_CLIENT_SECRET);
//   console.log('ETAS_SCOPE', process.env.ETAS_SCOPE);

//   try {
//     const response = await axios.post(
//       'https://p2.authz.bosch.com/auth/realms/EU_CALPONIA/protocol/openid-connect/token',
//       params,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Accept: 'application/json',
//         },
//       }
//     );

//     console.log('Authorization response:', response.data.access_token);

//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error fetching token:', error);
//     throw new Error('Failed to fetch token');
//   }
// };

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

// const generateAIContent = catchAsync(async (req, res) => {
//   const { prompt, user } = req.body;
//   if (!(await hasGenAIPermission(user || req.user?.id))) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to use GenAI service');
//   }
//   try {
//     const token = await getAccessToken();
//     const instance = process.env.ETAS_INSTANCE_ENDPOINT;

//     console.log('ETAS_INSTANCE_ENDPOINT', instance);

//     const response = await axios.post(
//       `https://${instance}/r2mm/GENERATE_AI`,
//       { prompt },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           Accept: 'application/json, text/plain, */*',
//         },
//       }
//     );

//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error generating AI content:', error);
//     return res.status(500).json({ error: 'Failed to generate AI content' });
//   }
// });

router.post(
  '/',
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

module.exports = router;

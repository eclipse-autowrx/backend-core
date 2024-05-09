const axios = require('axios');
const httpStatus = require('http-status');
const { db, auth } = require('../../config/firebase');
const { TENANT_ID } = require('../permissions');
const ApiError = require('../../utils/ApiError');
const { sendEmailByBrevo } = require('../../utils/brevo');

const resetPassword = async (req, res) => {
  try {
    if (req.method !== 'POST' || !req.body) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const request = req.body;
    if (!request.email || !request.captchaValue) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const { data } = await axios.get(
      `https://google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${request.captchaValue}`
    );

    if (!data || !data.success) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid captcha');
    }

    const userQuery = await db
      .collection('user')
      .where('tenant_id', '==', TENANT_ID)
      .where('email', '==', request.email)
      .get();

    if (!userQuery || userQuery.empty) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No user with provided email');
    }

    const user = userQuery.docs[0].data();
    if (user.provider && user.provider !== 'Email') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `This email is registered with a ${user.provider} account. Please log in using ${user.provider}!`
      );
    }

    const resetLink = await auth.generatePasswordResetLink(request.email, {
      url: request.returnURL || null,
    });

    await sendEmailByBrevo(
      [
        {
          name: user.name || 'user',
          email: user.email,
        },
      ],
      '[digital.auto] Reset your password',
      `
        <p>Hello ${user.name || 'user'},</p>

        <p>Follow this link to reset your <b>digital.auto</b> password for ${user.email} account.</p>

        <p><a href="${resetLink}">${resetLink}</a></p>

        <p>If you didn’t ask to reset your password, you can ignore this email.</p>

        <p>Thanks,</p>
        <p><b>digital.auto team</b></p>
      `
    );

    res.status(200).json({ email: request.email });
  } catch (error) {
    res.status(error.statusCode || httpStatus.BAD_REQUEST).send(error.toString());
  }
};

module.exports = {
  resetPassword,
};

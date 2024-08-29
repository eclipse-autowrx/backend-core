const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, fileService } = require('../services');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser({
    ...req.body,
    provider: req.body?.provider || 'Email',
  });
  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('token', tokens.refresh.token, {
    expires: tokens.refresh.expires,
    ...config.jwt.cookieRefreshOptions,
  });
  delete tokens.refresh;
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('token', tokens.refresh.token, {
    expires: tokens.refresh.expires,
    ...config.jwt.cookieRefreshOptions,
  });
  delete tokens.refresh;
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.cookies.token);
  res.clearCookie('token');
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.cookies.token);
  res.cookie('token', tokens.refresh.token, {
    expires: tokens.refresh.expires,
    ...config.jwt.cookieRefreshOptions,
  });
  delete tokens.refresh;

  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const githubCallback = catchAsync(async (req, res) => {
  try {
    const { origin, code, userId } = req.query;
    await authService.githubCallback(code, userId);
    res.redirect(`${origin || 'http://127.0.0.1:3000'}/auth/github/success`);
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send('Unauthorized. Please try again.');
  }
});

const sso = catchAsync(async (req, res) => {
  const { msAccessToken } = req.body;

  const graphData = await authService.callMsGraph(msAccessToken);
  if (!graphData) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  let user = await userService.getUserByEmail(graphData.mail);

  if (!user) {
    const file = await fileService.getFileFromURL(graphData.userPhotoUrl);
    let url;
    if (file) {
      url = (await fileService.upload(file)).url;
    }

    user = await userService.createUser({
      name: graphData.displayName,
      email: graphData.mail,
      email_verified: true,
      image_file: url,
      provider_user_id: graphData.id,
    });
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('token', tokens.refresh.token, {
    expires: tokens.refresh.expires,
    ...config.jwt.cookieRefreshOptions,
  });
  delete tokens.refresh;

  res.send({ user, tokens });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  githubCallback,
  sso,
};

const httpStatus = require('http-status');
const { sendEmailByBrevo } = require('../../utils/brevo');
const ApiError = require('../../utils/ApiError');

const sendEmail = async (req, res) => {
  try {
    if (req.method !== 'POST' || !req.body) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const { subject, htmlContent, to } = req.body;

    if (!subject || !htmlContent || !to || !Array.isArray(to)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    await sendEmailByBrevo(to, subject, htmlContent);

    res.status(httpStatus.OK).send('Send email done!');
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.toString());
  }
};

module.exports = {
  sendEmail,
};

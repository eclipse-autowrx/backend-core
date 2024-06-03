const express = require('express');
const catchAsync = require('../../utils/catchAsync');
const { emailService } = require('../../services');
const validate = require('../../middlewares/validate');
const { emailValidation } = require('../../validations');
const config = require('../../config/config');

const router = express.Router();

if (config.env === 'development') {
  router.route('').post(
    validate(emailValidation.sendEmail),
    catchAsync(async (req, res) => {
      const { to, subject, content } = req.body;
      let html;
      try {
        html = JSON.parse(content);
      } catch (error) {
        html = content;
      }
      html = html.replace(/&lt;/g, '<');
      await emailService.sendEmail(to, subject, html);
      res.status(200).send();
    })
  );
}

module.exports = router;

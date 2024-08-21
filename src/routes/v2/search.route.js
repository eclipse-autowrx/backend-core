const express = require('express');
const { searchController } = require('../../controllers');
const { searchValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const config = require('../../config/config');

const router = express.Router();

router.get(
  '/',
  auth({
    optional: !config.strictAuth,
  }),
  validate(searchValidation.search),
  searchController.search
);

router.get(
  '/email/:email',
  auth({
    optional: !config.strictAuth,
  }),
  validate(searchValidation.searchUserByEmail),
  searchController.searchUserByEmail
);

module.exports = router;

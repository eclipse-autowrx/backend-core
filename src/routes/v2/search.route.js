const express = require('express');
const { searchController } = require('../../controllers');
const { searchValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.get('/', validate(searchValidation.search), searchController.search);

module.exports = router;

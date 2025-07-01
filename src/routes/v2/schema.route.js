// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const schemaValidation = require('../../validations/schema.validation');
const schemaController = require('../../controllers/schema.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(schemaValidation.createSchema), schemaController.createSchema)
  .get(validate(schemaValidation.getSchemas), schemaController.getSchemas);

router
  .route('/:schemaId')
  .get(validate(schemaValidation.getSchema), schemaController.getSchema)
  .patch(auth(), validate(schemaValidation.updateSchema), schemaController.updateSchema)
  .delete(auth(), validate(schemaValidation.deleteSchema), schemaController.deleteSchema);

module.exports = router;

const express = require('express');
const validate = require('../../middlewares/validate');
const issueValidation = require('../../validations/issue.validation');
const issueController = require('../../controllers/issue.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(issueValidation.createIssue), issueController.createIssue)
  .get(validate(issueValidation.getIssues), issueController.getIssues);

router.route('/by-api').get(validate(issueValidation.getIssueByApi), issueController.getIssueByApi);

router
  .route('/:issueId')
  .get(validate(issueValidation.getIssue), issueController.getIssue)
  .patch(validate(issueValidation.updateIssue), issueController.updateIssue)
  .delete(validate(issueValidation.deleteIssue), issueController.deleteIssue);

module.exports = router;

const express = require('express');
const auth  = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const monthlySummaryValidation = require('../../validations/monthlySummary.validation');
const monthlySummaryController = require('../../controllers/monthlySummary.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(monthlySummaryValidation.createMonthlySummary), monthlySummaryController.createMonthlySummary)
  .get(auth(), monthlySummaryController.getMonthlySummarys);

router
  .route('/:monthlySummaryId')
  .get(auth(), validate(monthlySummaryValidation.getMonthlySummary), monthlySummaryController.getMonthlySummary)
  .patch(auth(), validate(monthlySummaryValidation.updateMonthlySummary), monthlySummaryController.updateMonthlySummary)
  .delete(auth(), validate(monthlySummaryValidation.deleteMonthlySummary), monthlySummaryController.deleteMonthlySummary);

module.exports = router;

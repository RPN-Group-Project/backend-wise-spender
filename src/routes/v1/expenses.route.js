const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const expensesValidation = require('../../validations/expenses.validation');
const expensesController = require('../../controllers/expenses.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(expensesValidation.createExpense), expensesController.createExpense)
  .get(auth(), expensesController.getExpenses);

router.route('/user').get(auth(), expensesController.getExpensesByUser);
router.route('/user/sum').get(auth(), expensesController.getUserSumExpense);
router
  .route('/:expenseId')
  .get(auth(), validate(expensesValidation.getExpense), expensesController.getExpense)
  .patch(auth(), validate(expensesValidation.updateExpense), expensesController.updateExpense)
  .delete(auth(), validate(expensesValidation.deleteExpense), expensesController.deleteExpense);

module.exports = router;

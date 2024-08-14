const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { expensesService } = require('../services');

const createExpense = catchAsync(async (req, res) => {
  const expense = await expensesService.createExpense(req.body, req.user.id);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Expense Success',
    data: expense,
  });
});

const getExpenses = catchAsync(async (req, res) => {
  const filter = { expense: req.query.expense };
  const options = {
    take: req.query.take,
    pageNumber: req.query.skip,
  };

  const result = await expensesService.queryExpenses(filter, options);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Expenses Success',
    data: result,
  });
});

const getExpense = catchAsync(async (req, res) => {
  const expense = await expensesService.getExpenseById(req.params.expenseId);
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get Expense Success',
    data: expense,
  });
});

const updateExpense = catchAsync(async (req, res) => {
  const expense = await expensesService.updateExpenseById(req.params.expenseId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update Expense Success',
    data: expense,
  });
});

const deleteExpense = catchAsync(async (req, res) => {
  await expensesService.deleteExpenseById(req.params.expenseId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete Expense Success',
    data: null,
  });
});


module.exports = {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
};

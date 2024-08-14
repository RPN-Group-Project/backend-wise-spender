const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createExpenses = async (expensesBody) => {
  return prisma.expenses.create({
    data: expensesBody,
  });
};

const queryExpenses = async (filter, options) => {
  const { expenses } = filter;
  const { dataTake, pageNumber } = options;

  const expensess = await prisma.expenses.findMany({
    where: {
      name: {
        contains: expenses,
      },
    },
    include: {
      expesnses: true,
    },
    skip: (pageNumber - 1) * dataTake,
    take: dataTake,
    orderBy: {
      created_at: 'desc',
    },
  });

  return expensess;
};

const getExpensesById = async (id) => {
  return prisma.expenses.findFirst({
    where: {
      id,
    },
    include: {
      expesnses: true,
    },
  });
};

const updateExpensesById = async (expensesId, updateBody) => {
  const expenses = await getExpensesById(expensesId);

  if (!expenses) throw new ApiError(httpStatus.NOT_FOUND, 'Expenses not found');

  const updateExpenses = await prisma.expenses.update({
    where: {
      id: expensesId,
    },
    data: updateBody,
  });

  return updateExpenses;
};

const deleteExpensesById = async (expensesId) => {
  const expenses = await getExpensesById(expensesId);

  if (!expenses) throw new ApiError(httpStatus.NOT_FOUND, 'Expenses not Found');

  const deleteExpenses = await prisma.expenses.delete({
    where: {
      id: expensesId,
    },
  });

  return deleteExpenses;
};

module.exports = {
  createExpenses,
  queryExpenses,
  getExpensesById,
  updateExpensesById,
  deleteExpensesById,
};

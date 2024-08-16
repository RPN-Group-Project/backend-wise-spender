const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createExpense = async (expenseBody, user_id) => {
  return prisma.expenses.create({
    data: { ...expenseBody, user_id },
  });
};

const queryExpenses = async (filter, options) => {
  const { expense } = filter;
  const { take, pageNumber } = options;

  const expenses = await prisma.expenses.findMany({
    where: {
      description: {
        contains: expense,
      },
    },
    take: take ? take && parseInt(take) : undefined,
    skip: pageNumber ? (pageNumber - 1) * take && parseInt(pageNumber) : undefined,
    orderBy: {
      created_at: 'desc',
    },
  });

  return expenses;
};
const queryExpensesByUser = async (filter, options, user_id) => {
  const { expense, startDate, endDate } = filter;
  const { take, pageNumber, skip } = options;

  const expenses = await prisma.expenses.findMany({
    where: {
      description: {
        contains: expense,
      },
      user_id,
      date: {
        gte: startDate && new Date(startDate),
        lte: endDate && new Date(endDate),
      },
    },
    take: take ? take && Number(take) : undefined,
    skip,
    orderBy: {
      date: 'desc',
    },
    include: {
      Category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!expenses) throw new ApiError(httpStatus.NOT_FOUND, 'Expenses not found');

  // prisma count data
  const count = await prisma.expenses.aggregate({
    _count: {
      id: true,
    },
    where: {
      description: {
        contains: expense,
      },
      user_id,
      date: {
        gte: startDate && new Date(startDate),
        lte: endDate && new Date(endDate),
      },
    },
  });
  const totalPages = Math.ceil(count._count.id / take);
  return {
    expenses,
    metadata: {
      totalData: count._count.id,
      totalPages,
      page: pageNumber,
    },
  };
};

const getExpenseById = async (id) => {
  return prisma.expenses.findFirst({
    where: {
      id,
    },
  });
};

const updateExpenseById = async (expenseId, updateBody) => {
  const expense = await getExpenseById(expenseId);

  if (!expense) throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');

  const updateExpense = await prisma.expenses.update({
    where: {
      id: expenseId,
    },
    data: updateBody,
  });

  return updateExpense;
};

const deleteExpenseById = async (expenseId) => {
  const expense = await getExpenseById(expenseId);

  if (!expense) throw new ApiError(httpStatus.NOT_FOUND, 'Expense not Found');

  const deleteExpense = await prisma.expenses.delete({
    where: {
      id: expenseId,
    },
  });

  return deleteExpense;
};

const getExpensesByUser = async (filter, user_id) => {
  const { startDate, endDate } = filter;

  const expenses = await prisma.expenses.aggregate({
    where: {
      user_id,
      date: {
        gte: startDate && new Date(startDate),
        lte: endDate && new Date(endDate),
      },
    },
    _sum: {
      amount: true,
    },
  });

  if (!expenses) throw new ApiError(httpStatus.NOT_FOUND, 'Expenses not found');

  const userExpenseLimit = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      expense_limit: true,
    },
  });
  return { expenses, userExpenseLimit };
};
module.exports = {
  createExpense,
  queryExpenses,
  queryExpensesByUser,
  getExpenseById,
  updateExpenseById,
  deleteExpenseById,
  getExpensesByUser,
};

const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createCategory = async (categoryBody, user_id) => {
  const user = await userService.getUserById(user_id)

  const totalMonthlyBudget = user.category.reduce((acc, category) => acc + category.monthly_budget, 0)

  if(totalMonthlyBudget + categoryBody.monthly_budget > user.expense_limit){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Monthly budget category acc exceed user expense limit')
  }

  if(totalMonthlyBudget > user.expense_limit){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Monthly budget category acc exceed user expense limit')
  }

  return prisma.category.create({
    data: { ...categoryBody, user_id },
  });
};

const queryCategorys = async (filter, options) => {
  const { category, user_id } = filter;
  const { take, pageNumber } = options;

  const categorys = await prisma.category.findMany({
    where: {
      name: {
        contains: category,
      },
      user_id,
    },
    include: {
      expenses: true,
    },
    take: take ? take && parseInt(take) : undefined,
    skip: pageNumber ? (pageNumber - 1) * take && parseInt(pageNumber) : undefined,
    orderBy: {
      created_at: 'desc',
    },
  });

  return categorys;
};

const getCategoryById = async (id) => {
  return prisma.category.findFirst({
    where: {
      id,
    },
    include: {
      expenses: true,
    },
  });
};

const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);

  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');

  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: updateBody,
  });

  return updateCategory;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);

  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not Found');

  const deleteCategory = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return deleteCategory;
};

module.exports = {
  createCategory,
  queryCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};

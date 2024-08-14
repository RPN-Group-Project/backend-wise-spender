const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCategory = async (categoryBody, user_id) => {
  return prisma.category.create({
    data: {...categoryBody, user_id},
  });
};

const queryCategorys = async (filter, options) => {
  const { category } = filter;
  const { take, pageNumber } = options;

  const categorys = await prisma.category.findMany({
    where: {
      name: {
        contains: category,
      },
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

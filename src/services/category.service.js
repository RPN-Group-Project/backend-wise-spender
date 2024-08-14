const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCategory = async (categoryBody) => {
  return prisma.category.create({
    data: categoryBody,
  });
};

const queryCategory = async (filter, options) => {
  const { category } = filter;
  const { dataTake, pageNumber } = options;

  const categorys = await prisma.category.findMany({
    where: {
      name: {
        contains: category,
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

  return categorys;
};

const getCategoryById = async (id) => {
  return prisma.category.findFirst({
    where: {
      id,
    },
    include: {
      expesnses: true,
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
  queryCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};

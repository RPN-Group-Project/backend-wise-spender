const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createMonthlySummary = async (monthlySummaryBody, user_id) => {
  return prisma.monthlySummary.create({
    data: {...monthlySummaryBody, user_id},
  });
};

const queryMonthlySummarys = async (filter, options) => {
  const { monthlysummary } = filter;
  const { take, pageNumber } = options;

  const monthlysummarys = await prisma.monthlySummary.findMany({
    where: {
      month: {
        contains: monthlysummary,
      },
    },
    take: take ? take && parseInt(take) : undefined,
    skip: pageNumber ? (pageNumber - 1) * take && parseInt(pageNumber) : undefined,
    orderBy: {
      created_at: 'desc',
    },
  });

  return monthlysummarys;
};

const getMonthlySummaryById = async (id) => {
  return prisma.monthlySummary.findFirst({
    where: {
      id,
    },
  });
};

const updateMonthlySummaryById = async (monthlySummaryId, updateBody) => {
  const monthlySummary = await getMonthlySummaryById(monthlySummaryId);

  if (!monthlySummary) throw new ApiError(httpStatus.NOT_FOUND, 'MonthlySummary not found');

  const updateMonthlySummary = await prisma.monthlySummary.update({
    where: {
      id: monthlySummaryId,
    },
    data: updateBody,
  });

  return updateMonthlySummary;
};

const deleteMonthlySummaryById = async (monthlySummaryId) => {
  const monthlySummary = await getMonthlySummaryById(monthlySummaryId);

  if (!monthlySummary) throw new ApiError(httpStatus.NOT_FOUND, 'MonthlySummary not Found');

  const deleteMonthlySummary = await prisma.monthlySummary.delete({
    where: {
      id: monthlySummaryId,
    },
  });

  return deleteMonthlySummary;
};

module.exports = {
  createMonthlySummary,
  queryMonthlySummarys,
  getMonthlySummaryById,
  updateMonthlySummaryById,
  deleteMonthlySummaryById,
};

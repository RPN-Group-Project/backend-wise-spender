const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { monthlySummaryService } = require('../services');

const createMonthlySummary = catchAsync(async (req, res) => {
  const monthlySummary = await monthlySummaryService.createMonthlySummary(req.body, req.user.id);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create MonthlySummary Success',
    data: monthlySummary,
  });
});

const getMonthlySummarys = catchAsync(async (req, res) => {
  const filter = { monthlySummary: req.query.monthlySummary };
  const options = {
    take: req.query.take,
    pageNumber: req.query.skip,
  };

  const result = await monthlySummaryService.queryMonthlySummarys(filter, options);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get MonthlySummarys Success',
    data: result,
  });
});

const getMonthlySummary = catchAsync(async (req, res) => {
  const monthlySummary = await monthlySummaryService.getMonthlySummaryById(req.params.monthlySummaryId);
  if (!monthlySummary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MonthlySummary not found');
  }

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Get MonthlySummary Success',
    data: monthlySummary,
  });
});

const updateMonthlySummary = catchAsync(async (req, res) => {
  const monthlySummary = await monthlySummaryService.updateMonthlySummaryById(req.params.monthlySummaryId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Update MonthlySummary Success',
    data: monthlySummary,
  });
});

const deleteMonthlySummary = catchAsync(async (req, res) => {
  await monthlySummaryService.deleteMonthlySummaryById(req.params.monthlySummaryId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: 'Delete MonthlySummary Success',
    data: null,
  });
});


module.exports = {
  createMonthlySummary,
  getMonthlySummarys,
  getMonthlySummary,
  updateMonthlySummary,
  deleteMonthlySummary,
};

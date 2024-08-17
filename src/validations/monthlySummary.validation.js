const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMonthlySummary = {
  body: Joi.object().keys({
    month: Joi.string().required(),
    total_spent: Joi.number(),
    remaining_budget: Joi.number(),
  }),
};

const getMonthlySummary = {
  params: Joi.object().keys({
    monthlySummaryId: Joi.string().custom(objectId),
  }),
};

const updateMonthlySummary = {
  params: Joi.object().keys({
    monthlySummaryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        month: Joi.string().required(),
        total_spent: Joi.number(),
        remaining_budget: Joi.number(),
    })
    .min(1),
};

const deleteMonthlySummary = {
  params: Joi.object().keys({
    monthlySummaryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMonthlySummary,
  getMonthlySummary,
  updateMonthlySummary,
  deleteMonthlySummary,
};

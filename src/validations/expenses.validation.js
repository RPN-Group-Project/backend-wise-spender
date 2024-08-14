const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createExpense = {
  body: Joi.object().keys({
    category_id: Joi.string().custom(objectId),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    date: Joi.date()
  }),
};

const getExpense = {
  params: Joi.object().keys({
    expenseId: Joi.string().custom(objectId),
  }),
};

const updateExpense = {
  params: Joi.object().keys({
    expenseId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      amount: Joi.number().required(),
      description: Joi.string().required(),
      date: Joi.date()
    })
    .min(1),
};

const deleteExpense = {
  params: Joi.object().keys({
    expenseId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
};

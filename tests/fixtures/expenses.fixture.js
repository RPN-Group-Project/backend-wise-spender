const { faker } = require ('@faker-js/faker')
const prisma = require('../../prisma')
const { userOne } = require('./user.fixture')
const { categoryOne } = require('./category.fixture')

const expensesOne = {
    id: faker.string.uuid(),
    user_id: userOne.id,
    category_id: categoryOne.id,
    amount: faker.number.int({min: 1000, max: 500000}),
    description: faker.commerce.productName(),
    date: faker.date.past()
}

const insertExpenses = async(expense) => {
    await prisma.expenses.createMany({
        data:expense,
        skipDuplicates: true
    })
}

module.exports = {
    expensesOne,
    insertExpenses
}
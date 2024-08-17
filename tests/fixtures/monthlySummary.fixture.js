const { faker } = require ('@faker-js/faker')
const prisma = require('../../prisma')
const { userOne } = require('./user.fixture')

const monthlySummaryOne = {
    id: faker.string.uuid(),
    user_id: userOne.id,
    month: faker.date.month(),
    total_spent: faker.number.int({min: 100000, max: 5000000}),
    remaining_budget: faker.number.int({min: 1000, max: 500000}),
}

const insertMonthlySummarys = async(monthlySummary) => {
    await prisma.monthlySummary.createMany({
        data:monthlySummary,
        skipDuplicates: true
    })
}

module.exports = {
    monthlySummaryOne,
    insertMonthlySummarys
}
const { faker } = require ('@faker-js/faker')
const prisma = require('../../prisma')
const { userOne } = require('./user.fixture')

const categoryOne = {
    id: faker.string.uuid(),
    user_id: userOne.id,
    name: faker.commerce.product(),
    monthly_budget: faker.number.int({min: 200, max: 3000000})
}

const insertCategory = async(category) => {
    await prisma.category.createMany({
        data:category,
        skipDuplicates: true
    })
}

module.exports = {
    categoryOne,
    insertCategory
}
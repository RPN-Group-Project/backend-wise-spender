const { v4 } = require('uuid');
const { faker } = require ('@faker-js/faker')
const prisma = require('../../prisma')

const categoryOne = {
    id: v4(),
    name: faker.commerce.product()
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
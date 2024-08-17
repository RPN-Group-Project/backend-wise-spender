const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const prisma = require('../../prisma')

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  expense_limit: faker.number.int({ min: 5000000, max: 10000000 }),
  isEmailVerified: false,
};

const userTwo = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  expense_limit: faker.number.int({ min: 100, max: 10000000 }),
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  users = users.map((user) => ({ ...user, password: hashedPassword }));
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
};

module.exports = {
  userOne,
  userTwo,
  insertUsers,
};

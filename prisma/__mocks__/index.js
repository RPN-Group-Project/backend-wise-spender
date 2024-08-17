const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const { join } = require('path');
global.atob = require('atob')

const generateDatabaseURL = () => {
  if (!process.env.DB_TEST) {
    throw new Error('please provide a database url');
  }
  let url = process.env.DB_TEST;

  url = url.replace('/postgres', '/testingDb');
  return url;
};

const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');

const url = generateDatabaseURL();

process.env.DB_TEST = url;

const prisma = new PrismaClient({
  datasources: { db: { url } },
});

beforeAll(async () => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DB_TEST: url,
    },
  });
});

beforeEach(async () => {
  await prisma.monthlySummary.deleteMany();
  await prisma.expenses.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.token.deleteMany();
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS testingDb`);
  await prisma.$disconnect();
});

module.exports = prisma;

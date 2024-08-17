const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { insertUsers, userOne } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');

describe('user routes', () =>{
    let newUser;
    beforeEach(async () => {
        await insertUsers([userOne])
        newUser = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'password123',
            expense_limit: faker.number.int({min: 3000000, max:10000000})
        }
    })

    describe('GET /v1/user', () =>{
        test('should return 200 OK if success get users', async() => {
            await request(app)
            .get('/v1/users')
            .set('Authorization', `Bearer ${userOneAccessToken }`)
            .expect(httpStatus.OK)
        })
    })

    describe('/v1/users/:userId', () => {
        test('should return 200 OK, if success get users by userId', async() => {
            await insertUsers([userOne])

            await request(app)
            .get(`/v1/users/${userOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken }`)
            .expect(httpStatus.OK)
        })

        test('Should return 200 and success update users by userId', async () => {
            newUser = {
                name: 'testUpdate'
            }

           const res =  await request(app)
            .patch(`/v1/users/${userOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken }`)
            .send(newUser)
            .expect(httpStatus.OK)

            const userData = res.body.data;
            
            const dbUser = await prisma.user.findUnique({
                where: {id: userData.id}
            })

            expect(dbUser).toBeDefined();
            expect(dbUser).toMatchObject({
                id: expect.anything(),
                name: userData.name,
                email: userData.email,
                password: userData.password,
                expense_limit: userData.expense_limit,
                createdAt: expect.anything(),
                updateAt: expect.anything(),
                isEmailVerified: false
            })
          });

          test('should return 200 OK if success delete users by userId', async() =>{
            await insertUsers([userOne])

            await request(app)
            .delete(`/v1/users/${userOne.id}`)
            .set('Authorization', `Bearer ${userOneAccessToken }`)
            .expect(httpStatus.OK)
          })
    })

    describe('ERROR TEST', () =>{
        test('should return 400 BAD REQUEST if user id is not valid', async() => {
            await request(app)
            .get(`/v1/users/noValidId`)
            .set('Authorization', `Bearer ${userOneAccessToken }`)
            .expect(httpStatus.BAD_REQUEST)
        })

        test('should return 401 UNAUTHORIZED if no access token', async() => {
            await request(app)
            .get(`/v1/users`)
            .send(newUser)
            .expect(httpStatus.UNAUTHORIZED)
        })
        
        test('should return 404 NOT_FOUND if no user is found', async() => {
            await request(app)
            .get(`/v1/users/${faker.string.uuid()}`)
            .set('Authorization', `Bearer ${userOneAccessToken }`)
            .expect(httpStatus.NOT_FOUND)
        })

    })
})
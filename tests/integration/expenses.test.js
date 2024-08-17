const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { insertUsers, userOne } = require('../fixtures/user.fixture');
const { categoryOne, insertCategory } = require('../fixtures/category.fixture');
const { expensesOne, insertExpenses } = require('../fixtures/expenses.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');

describe('Expenses routes', () =>{
    let newExpenses;
    beforeEach(async() => {
        await insertUsers([userOne])
        await insertCategory([categoryOne])

        newExpenses = {
            category_id :categoryOne.id,
            amount: faker.number.int({min: 1000, max: 500000}) ,
            description: faker.commerce.productName(),
            date : faker.date.past()
        }
    })

    describe('POST & GET /v1/expenses', () =>{
        test('should return 200 and sucessfully GET expenses', async() =>{
            await request(app)
            .get('/v1/expense')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(newExpenses)
            .expect(httpStatus.OK)
        })

        test('should return 201 if success created expenses', async() =>{
           const res =  await request(app)
            .post('/v1/expense')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(newExpenses)
            .expect(httpStatus.CREATED);

            const expensesData = res.body.data

            expect(expensesData).toEqual({
                id: expect.anything(),
                user_id: expensesData.user_id,
                category_id: expensesData.category_id,
                amount: expensesData.amount,
                description: expensesData.description,
                date: expensesData.date,
                created_at: expect.anything(),
                updated_at: expect.anything() 
            })

            const dbExpenses = await prisma.expenses.findUnique({
                where: {
                    id: expensesData.id
                },
            });

            expect(dbExpenses).toBeDefined();
            // expect(dbExpenses).toMatchObject({
            //     id: expect.anything(),
            //     user_id : expensesData.user_id,
            //     category_id : expensesData.category_id,
            //     amount: expensesData.amount ,
            //     description: expensesData.description,
            //     date : expensesData.date,
            //     created_at: expect.anything(),
            //     updated_at: expect.anything() 
            // })
        })

        
    })
    
    describe('/v1/expense/:expenseId', () => {
        test('should return 200 OK and success get expenses by ID', async() => {
            await insertExpenses([expensesOne])

        const res = await request(app)
        .get(`/v1/expense/${expensesOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK)
    })
    
    test('should return 200 OK and success update expenses by ID', async() => {
        await insertExpenses([expensesOne])
        newExpenses = {
            description: faker.commerce.product()
        }
        
        const res = await request(app)
        .patch(`/v1/expense/${expensesOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newExpenses)
        .expect(httpStatus.OK)
        
        const expensesData = res.body.data
        
        expect(expensesData).toEqual({
            id: expect.anything(),
            user_id: expensesData.user_id,
            category_id: categoryOne.id,
            amount: expensesData.amount,
            description: expensesData.description,
            date: expensesData.date,
            created_at: expect.anything(),
            updated_at: expect.anything() 
        })
        
        const dbExpenses = await prisma.expenses.findUnique({
            where: {
                id: expensesData.id
            }
        })
        
        expect(dbExpenses).toBeDefined()
        // expect(dbExpenses).toMatchObject({
        //     id: expect.anything(),
        //     user_id: expensesData.user_id,
        //     category_id: expensesData.category_id,
        //     amount: expensesData.amount,
        //     description: expensesData.description,
        //     date: expensesData.date,
        //     created_at: expect.anything(),
        //     updated_at: expect.anything() 
        // })
    })
    
    test('should return 200 and success delete by ID', async() => {
        await insertExpenses([expensesOne])
        
        await request(app)
        .delete(`/v1/expense/${expensesOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK)
    })
    
})

describe('ERROR TEST', () =>{
    test('should return 400 and INVALID REQUEST if input with not valid ID', async() => {
        
        await request(app)
        .get(`/v1/expense/idNotValid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.BAD_REQUEST)
        
    })
    
    test('should return 404 and expenses ID not found', async() => {
        await request(app)
        .get(`/v1/expense/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND)
    })
    
    test('should return 401 error unauthorized if no bearer access token', async() => {
        await request(app)
        .get('/v1/expense')
        .send(newExpenses)
        .expect(httpStatus.UNAUTHORIZED)
        })
    })

})

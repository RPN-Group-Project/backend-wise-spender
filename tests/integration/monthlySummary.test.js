const request = require('supertest');
const {faker} = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { insertUsers, userOne } = require('../fixtures/user.fixture');
const { monthlySummaryOne, insertMonthlySummarys } = require('../fixtures/monthlySummary.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
const prisma = require('../../prisma');

describe('MonthlySummary routes', () =>{
    let newMonthlySummary;
    beforeEach(async() => {
        await insertUsers([userOne])

        newMonthlySummary = {
            month: faker.date.month(),
            total_spent: faker.number.int({min: 100000, max: 5000000}),
            remaining_budget: faker.number.int({min: 1000, max: 500000}),
        }
    })

    describe('POST & GET /v1/monthlySummary', () =>{
        test('should return 200 and sucessfully GET monthlySummarys ', async() =>{
            await request(app)
            .get('/v1/monthlySummary')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(newMonthlySummary)
            .expect(httpStatus.OK)
        })

        test('should return 201 if success created monthlysummarys', async() =>{
           const res =  await request(app)
            .post('/v1/monthlySummary')
            .set('Authorization', `Bearer ${userOneAccessToken}`)
            .send(newMonthlySummary)
            .expect(httpStatus.CREATED);

            const monthlysummaryData = res.body.data

            expect(monthlysummaryData).toEqual({
                id: expect.anything(),
                user_id: monthlysummaryData.user_id,
                month: monthlysummaryData.month,
                total_spent: monthlysummaryData.total_spent,
                remaining_budget: monthlysummaryData.remaining_budget ,
                created_at: expect.anything(),
                updated_at: expect.anything() 
            })

            const dbMonthlySummary = await prisma.monthlySummary.findUnique({
                where: {
                    id: monthlysummaryData.id
                },
            });

            expect(dbMonthlySummary).toBeDefined();
            expect(dbMonthlySummary).toMatchObject({
                id: expect.anything(),
                user_id: monthlysummaryData.user_id,
                month: monthlysummaryData.month,
                total_spent: monthlysummaryData.total_spent,
                remaining_budget: monthlysummaryData.remaining_budget ,
                created_at: expect.anything(),
                updated_at: expect.anything() 
            })
        })

        
    })
    
    describe('/v1/monthlySummary/:monthlysummaryId', () => {
        test('should return 200 OK and success get monthlysummary by ID', async() => {
            await insertMonthlySummarys([monthlySummaryOne])

        const res = await request(app)
        .get(`/v1/monthlySummary/${monthlySummaryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK)
    })
    
    test('should return 200 OK and success update monthlysummary by ID', async() => {
        await insertMonthlySummarys([monthlySummaryOne])
        newMonthlySummary = {
            month: faker.date.month()
        }
        
        const res = await request(app)
        .patch(`/v1/monthlySummary/${monthlySummaryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newMonthlySummary)
        .expect(httpStatus.OK)
        
        const monthlysummaryData = res.body.data

        
        expect(monthlysummaryData).toEqual({
            id: expect.anything(),
            user_id: monthlysummaryData.user_id,
            month: monthlysummaryData.month,
            total_spent: monthlysummaryData.total_spent,
            remaining_budget: monthlysummaryData.remaining_budget ,
            created_at: expect.anything(),
            updated_at: expect.anything()  
        })
        
        const dbMonthlySummary = await prisma.monthlySummary.findUnique({
            where: {
                id: monthlysummaryData.id
            }
        })
        
        expect(dbMonthlySummary).toBeDefined()
        expect(dbMonthlySummary).toMatchObject({
            id: expect.anything(),
            user_id: monthlysummaryData.user_id,
            month: monthlysummaryData.month,
            total_spent: monthlysummaryData.total_spent,
            remaining_budget: monthlysummaryData.remaining_budget ,
            created_at: expect.anything(),
            updated_at: expect.anything() 
        })
    })
    
    test('should return 200 and success delete by ID', async() => {
        await insertMonthlySummarys([monthlySummaryOne])
        
        await request(app)
        .delete(`/v1/monthlySummary/${monthlySummaryOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK)
    })
    
})

describe('ERROR TEST', () =>{
    test('should return 400 and INVALID REQUEST if input with not valid ID', async() => {
        
        await request(app)
        .get(`/v1/monthlysummary/idNotValid`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.BAD_REQUEST)
        
    })
    
    test('should return 404 and monthlysummary ID not found', async() => {
        await request(app)
        .get(`/v1/monthlysummary/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND)
    })
    
    test('should return 401 error unauthorized if no bearer access token', async() => {
        await request(app)
        .get('/v1/monthlysummary')
        .send(newMonthlySummary)
        .expect(httpStatus.UNAUTHORIZED)
        })
    })

})

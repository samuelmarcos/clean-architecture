import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
    const password =  await hash('123', 12)
    const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com.br',
        password: password,
        passwordConfirmation: password
    })
    const id = res.ops[0]._id
    const accessToken = sign({id}, env.jwtSecret)
    await accountCollection.updateOne({
        _id: id
    },{
       $set: { accessToken }
    })

    return accessToken
}

describe('Survey routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection('accounts')
        await surveyCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    describe('PUT /surveys/:surveyId/results', () => {
        test('should return 403 on save survey result without accessToken', async () => {
            await request(app)
                .put('api/surveys/any_id/results')
                .send({
                    answer: 'any_answer'
                })
                .expect(403)
        })

        test('should return 200 on save survey result with accessToken', async () => {
            const accessToken = await makeAccessToken()
            const res = await surveyCollection.insertOne(
                {
                    question: 'any_question',
                    answers: [{
                        image: 'http://image-name.com',
                        answer : 'answer1'
                    }, {
                        answer : 'answer2'   
                    }],
                    date: new Date()
                }
            )
            const surveyId = res.ops[0].id
            await request(app)
                .put(`api/surveys/${surveyId}/results`)
                .set('x-access-token', accessToken)
                .send({
                    answer: 'answer1'
                })
                .expect(403)
        })
    }) 

    describe('GET /surveys/:surveyId/results', () => {
        test('should return 403 on load survey result without accessToken', async () => {
            await request(app)
                .get('api/surveys/any_id/results')
                .expect(403)
        })

        test('should return 200 on save survey result with accessToken', async () => {
            const accessToken = await makeAccessToken()
            const res = await surveyCollection.insertOne(
                {
                    question: 'any_question',
                    answers: [{
                        image: 'http://image-name.com',
                        answer : 'answer1'
                    }, {
                        answer : 'answer2'   
                    }],
                    date: new Date()
                }
            )
            const surveyId = res.ops[0].id
            await request(app)
                .put(`api/surveys/${surveyId}/results`)
                .set('x-access-token', accessToken)
                .send({
                    answer: 'answer1'
                })
                .expect(403)
        })
    }) 
})
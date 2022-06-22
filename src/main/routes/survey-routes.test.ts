import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

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
    describe('POST /surveys', () => {
        test('should return 403 on add surveys without accessToken', async () => {
            app.post('api/surveys', (req, res) => res.send(req.body))
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'any_question',
                    answers: [{
                        image: 'http://image-name.com',
                        answer : 'any_answer'
                    }, {
                        answer : 'any_answer'   
                    }]
                })
                .expect(403)
        })

        test('should return 204 on add surveys with valid accessToken', async () => {
            const password = await hash('123', 12)
            const res = await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: password,
                passwordConfirmation: password,
                role: 'admin'
            })
            const id = res.ops[0]._id
            const accessToken = sign({id}, env.jwtSecret)
            await accountCollection.updateOne({
                _id: id
            },{
               $set: { accessToken }
            })
            app.post('api/surveys', (req, res) => res.send(req.body))
            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .send({
                    question: 'any_question',
                    answers: [{
                        image: 'http://image-name.com',
                        answer : 'any_answer'
                    }, {
                        answer : 'any_answer'   
                    }]
                })
                .expect(204)
        })
    })

    describe('GET /surveys', () => {
        test('should return 403 on load surveys without accessToken', async () => {
            app.post('api/surveys', (req, res) => res.send(req.body))
            await request(app)
                .get('/api/surveys')
                .expect(403)
        })

        test('should return 204 on load surveys with valid accessToken', async () => {
            const password = await hash('123', 12)
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
            await surveyCollection.insertMany([
                {
                    id: 'any_id',
                    question: 'any_question',
                    answers: [{
                        image: 'any_image',
                        answer: 'any_answer'
                    }],
                    date: new Date()
                },
        
                {
                    id: 'other_id',
                    question: 'other_question',
                    answers: [{
                        image: 'other_id',
                        answer: 'other_id'
                    }],
                    date: new Date()
                }
            ])
            app.get('api/surveys', (req, res) => res.send(req.body))
            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .expect(204)
        })
    })
})
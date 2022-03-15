import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    describe('POST /signup', () => {
        test('should return 200 on signup', async () => {
            app.post('api/signup', (req, res) => res.send(req.body))
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'any_name',
                    email: 'any_email@email.com.br',
                    password: 'any_password',
                    passwordConfirmation: 'any_password'
                })
                .expect(200)
        })
    })

    describe('POST /login', () => {
        test('should return 200 on login', async () => {
            const password = await hash('123', 12)
            await accountCollection.inserOne({
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: password,
                passwordConfirmation: password
            })
            app.post('api/login', (req, res) => res.send(req.body))
            await request(app)
                .post('/api/login')
                .send({
                    email: 'any_email@email.com.br',
                    password: 'any_password'
                })
                .expect(200)
        })
    })
})
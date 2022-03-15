import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
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
})
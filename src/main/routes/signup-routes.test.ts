import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Signup routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('should return an account on success', async () => {
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
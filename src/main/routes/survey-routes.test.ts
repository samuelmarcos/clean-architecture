import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'


let surveyCollection: Collection

describe('Survey routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    describe('POST /surveys', () => {
        test('should return 403 on add surveys success', async () => {
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
                .expect(204)
        })
    })
})
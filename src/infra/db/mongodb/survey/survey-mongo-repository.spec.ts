import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Account Mongo respository', () => {

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

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository()
    }

    const makeFakeSurveyModel = (): AddSurveyModel => {
        return {
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer : 'any_answer'
            }, {
                answer : 'any_answer'   
            }]
        }
    }

    test('should add on success', async () => {
        const sut = makeSut()

        const fakeSurveyModel = makeFakeSurveyModel()

        await sut.add(fakeSurveyModel)

        const survey = await surveyCollection.findOne({ question: 'any_question'})

        expect(survey).toBeTruthy()
    })

})
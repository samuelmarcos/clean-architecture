import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo respository', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
        surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        await surveyCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection('accounts')
        await surveyCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    const makeSurvey = async (): Promise<SurveyModel> => {
        const res = await accountCollection.insertOne({
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer : 'any_answer'
            }, {
                answer : 'any_answer'   
            }],
            date: new Date()
        })

        return res.insertedId
    }

    const makeAccount = async (): Promise<AccountModel> => {
        const res = await surveyCollection.insertOne({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
        })

        return res.insertedId
    }

    describe('save()', () => {
        test('should add a survey result if its new', async () => {

            const survey = await makeSurvey()
            const account = await makeAccount()
            const sut = makeSut()
    
            const surveyResult = await sut.save(
                {
                    surveyId: survey.id,
                    accountId: account.id,
                    answer: survey.answers[0].answer,
                    date: new Date()
                }
            )
    
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.id).toBeTruthy()
            expect(surveyResult.answer).toBe(survey.answers[0].answer)
        })
    })
})
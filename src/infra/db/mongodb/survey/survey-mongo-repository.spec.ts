import { Collection } from 'mongodb'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
}

describe('Survey Mongo respository', () => {

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

    const makeFakeSurveyModel = (): AddSurveyParams => {
        return {
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer : 'any_answer'
            }, {
                answer : 'any_answer'   
            }],
            date: new Date()
        }
    }

    describe('add()', () => {
        test('should add on success', async () => {
            const sut = makeSut()
    
            const fakeSurveyModel = makeFakeSurveyModel()
    
            await sut.add(fakeSurveyModel)
    
            const survey = await surveyCollection.findOne({ question: 'any_question'})
    
            expect(survey).toBeTruthy()
        })
    })

    describe('loadAll()', () => {
        test('should load all surveys on success', async () => {
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
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys[0].id).toBeTruthy()
            expect(surveys[0].question).toBe('any_question')
            expect(surveys[1].question).toBe('other_question')
        })

        test('should load empty list', async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })

    describe('loadById()', () => {
        test('should load survey by id on success', async () => {
            const res = await surveyCollection.insertOne({
                id: 'any_id',
                question: 'any_question',
                answers: [{
                    image: 'any_image',
                    answer: 'any_answer'
                }],
                date: new Date()
            })
            const id = res.insertedId;
            const sut = makeSut()
            const survey= await sut.loadById(id)
            expect(survey.question).toBeTruthy()
            expect(survey.id).toBeTruthy()
        })
    })
})
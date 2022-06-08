import { AddSurveyModel } from './db-add-survey-protocols'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from '../add-survey/db-add-survey'
import MockDate from 'mockdate'

describe('DbAddSurvey UseCase', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    beforeAll(() => {
        MockDate.reset()
    })

    interface SutTypes {
        sut: DbAddSurvey
        addSurveyRepositoryStub: AddSurveyRepository
    }

    const makeSut = (): SutTypes => {
        const addSurveyRepositoryStub =  makeAddSurveyRepositoryStub()
        const sut = new DbAddSurvey(addSurveyRepositoryStub)

        return { sut, addSurveyRepositoryStub }
    }

    const makeAddSurveyRepositoryStub = () => {
        class FakeAddSurveyRepository implements AddSurveyRepository {
            public async add(surveyData: AddSurveyModel): Promise<void> {
                return new Promise((resolve) => {
                    resolve()
                })
            }
        }

        return new FakeAddSurveyRepository()
    }

    const makeFakeSurveyModel = (): AddSurveyModel => {
        return {
            question: 'any_question',
            answers: [{
                image: 'any_image',
                answer : 'any_answer'
            }],
            date: new Date()
        }
    }

    test('should call AddSuveryRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub , 'add')
        const surveyData = makeFakeSurveyModel()
        await sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    test('should throw if AddSurveyRepository throws', async () => {
        const { addSurveyRepositoryStub, sut } = makeSut()
       
        jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise =  sut.add(makeFakeSurveyModel())
        await expect(promise).rejects.toThrow()
    })

})
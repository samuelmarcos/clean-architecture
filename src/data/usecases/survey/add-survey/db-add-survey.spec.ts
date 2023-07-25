import { AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
import { throwError } from '@/mocks/helpers'
import { mockAddSurveyRepository } from '@/mocks/data/db/mock-db-survey'
import { mockAddFakeSurveyParams } from '@/mocks/domain'

describe('DbAddSurvey UseCase', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    type SutTypes =  {
        sut: DbAddSurvey
        addSurveyRepositoryStub: AddSurveyRepository
    }

    const makeSut = (): SutTypes => {
        const addSurveyRepositoryStub = mockAddSurveyRepository()
        const sut = new DbAddSurvey(addSurveyRepositoryStub)

        return { sut, addSurveyRepositoryStub }
    }

    test('should call AddSuveryRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub , 'add')
        const surveyData = mockAddFakeSurveyParams()
        await sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })

    test('should throw if AddSurveyRepository throws', async () => {
        const { addSurveyRepositoryStub, sut } = makeSut()
       
        jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
        const promise =  sut.add(mockAddFakeSurveyParams())
        await expect(promise).rejects.toThrow()
    })
})
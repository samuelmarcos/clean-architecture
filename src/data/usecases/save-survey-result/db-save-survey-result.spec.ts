import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { throwError } from '@/mocks/helpers'
import { mockSurveyResult, mockSurveyResultParams } from '@/mocks/domain'
import { mockSaveResultSurveyRepository } from '@/mocks/data/db'
describe('DbSaveSurveyResult UseCase', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    type SutTypes =  {
        sut: DbSaveSurveyResult
        saveSurveyResultRepositoryStub: SaveSurveyResultRepository
    }

    const makeSut = (): SutTypes => {
        const saveSurveyResultRepositoryStub = mockSaveResultSurveyRepository()
        const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

        return { sut, saveSurveyResultRepositoryStub }
    }
  
    test('should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub , 'save')
        const surveyResultData = mockSurveyResult()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('should throw if SaveSurveyResultRepository throws', async () => {
        const { saveSurveyResultRepositoryStub, sut } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
        const promise = sut.save(mockSurveyResult())
        await expect(promise).rejects.toThrow()
    })

    test('Should return a survey on success', async () => {
      const { sut } = makeSut()
      const surveyResultData = await sut.save(mockSurveyResultParams())
      expect(surveyResultData).toEqual(mockSurveyResult())
    })
})
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { throwError } from '@/mocks/helpers'
import { mockSurveyResult, mockSurveyResultParams } from '@/mocks/domain'
import { mockSaveResultSurveyRepository, loadSurveyResultRepositoryMock } from '@/mocks/data/db'
import { LoadSurveyResultRepository } from '../load-survey-result.ts/db-load-survey-result-protocols'
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
        loadSurveyResultRepositoryStub: LoadSurveyResultRepository
    }

    const makeSut = (): SutTypes => {
        const saveSurveyResultRepositoryStub = mockSaveResultSurveyRepository()
        const loadSurveyResultRepositoryStub = loadSurveyResultRepositoryMock()
        const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

        return { sut, saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub }
    }
  
    test('should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub , 'save')
        const surveyResultData = mockSurveyResultParams()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('should throw if SaveSurveyResultRepository throws', async () => {
        const { saveSurveyResultRepositoryStub, sut } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
        const promise = sut.save(mockSurveyResultParams())
        await expect(promise).rejects.toThrow()
    })

    test('should call LoadSurveyResultRepository with correct values', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub , 'loadBySurveyId')
        const surveyResultData = mockSurveyResultParams()
        await sut.save(surveyResultData)
        expect(loadSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
    })

    test('should throw if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
        const promise = sut.save(mockSurveyResultParams())
        await expect(promise).rejects.toThrow()
    })

    test('Should return a survey on success', async () => {
      const { sut } = makeSut()
      const surveyResultData = await sut.save(mockSurveyResultParams())
      expect(surveyResultData).toEqual(mockSurveyResult())
    })
})
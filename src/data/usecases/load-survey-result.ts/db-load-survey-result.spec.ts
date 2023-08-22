import { throwError } from '@/mocks/helpers'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { loadSurveyResultRepositoryMock } from '@/mocks/data/db'
import { mockSurveyResult } from '@/mocks/domain'

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = loadSurveyResultRepositoryMock()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  
  return { sut, loadSurveyResultRepositoryStub }
}

describe('DbLoadSurveyResult UseCase', () => {
  test('shoudl call LoadSurveyResultRepository ', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_surveyId')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load('loadBySurveyId')
    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = await sut.load('any_surveyId')
    expect(surveyResultData).toEqual(mockSurveyResult())
  })
})
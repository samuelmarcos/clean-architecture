import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { loadSurveyResultRepositoryMock } from '@/mocks/data/db'

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
})
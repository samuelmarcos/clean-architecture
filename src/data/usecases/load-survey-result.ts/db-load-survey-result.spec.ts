import { mockSurveyResult } from '@/mocks/domain'
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

const loadSurveyResultRepositoryMock = () => {
  class LoadSurveyResultRepositoryMock implements LoadSurveyResultRepository {
    public async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryMock()
}

const makeSut = () => {
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
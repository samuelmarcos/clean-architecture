import MockDate from 'mockdate'
import { throwError } from '@/mocks/helpers'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { loadSurveyResultRepositoryMock, mockLoadSurveyByIdRepository } from '@/mocks/data/db'
import { mockSurveyResult } from '@/mocks/domain'

type SutTypes = {
  sut: LoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = loadSurveyResultRepositoryMock()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
      MockDate.reset()
  })

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

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    await sut.load('any_surveyId')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_surveyId')
  })

  test('Should return surveyResultModel with all anwsers with count 0 if LoadSurveyResultRepository returns null ', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_surveyId')
    expect(surveyResult).toEqual(mockSurveyResult())
  })

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = await sut.load('any_surveyId')
    expect(surveyResultData).toEqual(mockSurveyResult())
  })
})
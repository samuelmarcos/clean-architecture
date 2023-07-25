import { Controller, HttpRequest, SaveSurveyResult, SaveSurveyResultParams, SurveyModel, SurveyResultModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import MockDate from 'mockdate'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/mocks/helpers'
import { mockSurveyResult, mockSurveyResultModel } from '@/mocks/domain'
import { mockSaveSurveyResult, mockLoadSurveyById } from '@/mocks/presentation'

const mockRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    },
    body: {
      answer: 'any_answer'
    },
    accountId: 'any_account_id'
  }
}


interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('Save Survey result controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
      MockDate.reset()
  })

  test('shoud call load survey by id with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const spiedSurvey = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(spiedSurvey).toHaveBeenLastCalledWith('any_id')
  })

  test('shoud return 403 if load survey by id returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('invalid survey id')))
  })

  test('should return 500 if add survey throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('shoud return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('invalid survey id')))
  })

  test('shoud call save survey result by id with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const spiedSurvey = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(mockRequest())
    expect(spiedSurvey).toHaveBeenLastCalledWith(mockSurveyResultModel())
  })

  test('should return 500 if save survey result throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if save survey result on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveyResult()))
  })
})
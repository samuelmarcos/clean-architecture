import { Controller, HttpRequest, SaveSurveyResult, SaveSurveyResultModel, SurveyModel, SurveyResultModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import MockDate from 'mockdate'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => {
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

const makeFakeSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'image',
      answer: 'any_answer'
   }],
    date: new Date()
  }
}

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    public async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurveyModel())
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_id',
    surveyId: 'any_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date
  }
}

const makeFakeSurveyResultModel = (): SaveSurveyResultModel => {
  return {
    surveyId: 'any_id',
    accountId: 'any_account',
    answer: 'any_answer',
    date: new Date
  }
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    public async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}

interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
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
    await sut.handle(makeFakeRequest())
    expect(spiedSurvey).toHaveBeenLastCalledWith('any_id')
  })

  test('shoud return 403 if load survey by id returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('invalid survey id')))
  })

  test('should return 500 if add survey throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
    await sut.handle(makeFakeRequest())
    expect(spiedSurvey).toHaveBeenLastCalledWith(makeFakeSurveyResultModel())
  })

  test('should return 500 if save survey result throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if save survey result on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeSurveyResult()))
  })
})
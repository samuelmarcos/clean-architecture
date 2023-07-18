import { Controller, HttpRequest } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import { SurveyModel } from '../survey/load-surveys/load-surveys-controller-protocols'
import MockDate from 'mockdate'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    }
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

interface SutTypes {
  sut: Controller
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
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
})
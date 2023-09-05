import { forbidden } from "@/presentation/helpers/http/http-helper"
import { LoadSurveyById } from "../save-survey-result/save-survey-result-controller-protocols"
import { LoadSurveyResultController } from "./load-survey-result-controller"
import { HttpRequest } from "./load-survey-result-controller-protocols"
import { mockLoadSurveyById } from "@/mocks/presentation"
import { InvalidParamError } from "@/presentation/errors"

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const mockRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_id'
    }
  }
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return  { sut, loadSurveyByIdStub }
}


describe('Load Survey Result Controller', () => {
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper"
import { LoadSurveyById } from "../save-survey-result/save-survey-result-controller-protocols"
import { LoadSurveyResultController } from "./load-survey-result-controller"
import { HttpRequest } from "./load-survey-result-controller-protocols"
import { mockLoadSurveyById, mockSurveyResultUseCase } from "@/mocks/presentation"
import { InvalidParamError } from "@/presentation/errors"
import { throwError } from "@/mocks/helpers"
import { LoadSurveyResult } from "@/domain/usecases/survey-result/load-survey-result"

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultdStub: LoadSurveyResult
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
  const loadSurveyResultdStub = mockSurveyResultUseCase()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultdStub)

  return  { sut, loadSurveyByIdStub, loadSurveyResultdStub }
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

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultdStub } = makeSut()
    const loadspy = jest.spyOn(loadSurveyResultdStub, 'load')
    await sut.handle(mockRequest())
    expect(loadspy).toHaveBeenCalledWith('any_id')
  })

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultdStub } = makeSut()
    jest.spyOn(loadSurveyResultdStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
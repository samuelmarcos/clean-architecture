import { LoadSurveyById } from "../save-survey-result/save-survey-result-controller-protocols"
import { LoadSurveyResultController } from "./load-survey-result-controller"
import { HttpRequest } from "./load-survey-result-controller-protocols"
import { mockLoadSurveyById } from "@/mocks/presentation"

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
})
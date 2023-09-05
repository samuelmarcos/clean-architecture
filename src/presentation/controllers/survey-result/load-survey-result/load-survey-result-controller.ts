import { forbidden, serverError } from "@/presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./load-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)

      if(!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      
      return Promise.resolve({
        statusCode: 200,
        body: {}
      })
    } catch(error: any) {
      return serverError(error)
    }
  }
}
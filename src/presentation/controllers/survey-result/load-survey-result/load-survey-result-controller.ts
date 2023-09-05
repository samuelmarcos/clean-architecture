import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./load-survey-result-controller-protocols";

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    
    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
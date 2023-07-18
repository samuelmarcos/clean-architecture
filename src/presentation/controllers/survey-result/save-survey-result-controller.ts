import { LoadSurveyById } from "@/domain/usecases/survey/load-surveys-by-id";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {

  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    const surveyId = httpRequest.params.surveyId

    await this.loadSurveyById.loadById(surveyId)
    
    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
import { LoadSurveyById } from "@/domain/usecases/survey/load-surveys-by-id";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {

  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

   try {
    const surveyId = httpRequest.params.surveyId

    const survey = await this.loadSurveyById.loadById(surveyId)

    if(!survey) return forbidden(new InvalidParamError('invalid survey id'))
    
    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
   } catch(error: any) {
      return serverError(error)
   }
  }
}
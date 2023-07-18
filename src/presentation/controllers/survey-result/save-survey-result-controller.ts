import { LoadSurveyById } from "@/domain/usecases/survey/load-surveys-by-id";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {

  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

   try {
    const { surveyId } = httpRequest.params
    const { answer }  = httpRequest.body  
    const survey = await this.loadSurveyById.loadById(surveyId)

    if(survey) {
      const answers = survey.answers.map(a => a.answer)
      if(!answers.includes(answer)) {
        return forbidden(new InvalidParamError('invalid answer'))
      }
    } else {
      return forbidden(new InvalidParamError('invalid survey id'))
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
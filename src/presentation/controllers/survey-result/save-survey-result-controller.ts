import { SaveSurveyResult, SaveSurveyResultModel, LoadSurveyById } from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols";

export class SaveSurveyResultController implements Controller {

  constructor(private readonly loadSurveyById: LoadSurveyById,
              private readonly saveSurveyResult: SaveSurveyResult) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

   try {
    const { surveyId } = httpRequest.params
    const { answer }  = httpRequest.body  
    const accountId = httpRequest.accountId
    const survey = await this.loadSurveyById.loadById(surveyId)

    if(survey) {
      const answers = survey.answers.map(a => a.answer)
      if(!answers.includes(answer)) {
        return forbidden(new InvalidParamError('invalid answer'))
      }
    } else {
      return forbidden(new InvalidParamError('invalid survey id'))
    }

    const surveySusultModel: SaveSurveyResultModel = { surveyId: surveyId, accountId: accountId!, answer: answer, date: new Date() }
    await this.saveSurveyResult.save(surveySusultModel)

    return ok({})

   } catch(error: any) {
      return serverError(error)
   }
  }
}
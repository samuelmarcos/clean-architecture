import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, LoadSurveyResult } from "./load-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById,
              private readonly loadSurveyResult: LoadSurveyResult) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)

      if(!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResult.load(survey.id)
      
      return ok(surveyResult)

    } catch(error: any) {
      return serverError(error)
    }
  }
}
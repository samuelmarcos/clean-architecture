import { LoadSurveyResult } from "@/domain/usecases/survey-result/load-survey-result";
import { SurveyResultModel } from "../save-survey-result/db-save-survey-result-protocols";
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository";

export class DbLoadSurveyResult implements LoadSurveyResult {

  constructor(private readonly repository: LoadSurveyResultRepository) {}

  public async load(surveyId: string): Promise<SurveyResultModel> {
    await this.repository.loadBySurveyId(surveyId)
    return Promise.resolve(null)
  }
  
}
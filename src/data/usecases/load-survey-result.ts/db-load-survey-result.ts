import { LoadSurveyResultRepository, LoadSurveyResult, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {

  constructor(private readonly repository: LoadSurveyResultRepository) {}

  public async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.repository.loadBySurveyId(surveyId)
    return surveyResult
  }
  
}
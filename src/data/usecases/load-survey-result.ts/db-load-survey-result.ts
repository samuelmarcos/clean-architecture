import { LoadSurveyResultRepository, LoadSurveyResult, SurveyResultModel, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {

  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
              private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  public async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if(surveyResult !== null) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }

    return surveyResult!
  }
  
}
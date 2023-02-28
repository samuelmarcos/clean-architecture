import { SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {

  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  public async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(data)
    return surveyResult
  }
}
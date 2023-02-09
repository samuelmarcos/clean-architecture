import { SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {

  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    throw new Error("Method not implemented.");
  }
}
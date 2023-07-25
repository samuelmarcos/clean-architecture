import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResult, SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result"
import { mockSurveyResult } from "../domain"

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    public async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResult())
    }
  }
  return new SaveSurveyResultStub()
}
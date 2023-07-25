import { SurveyModel } from "@/domain/models/survey"
import { LoadSurveyById } from "@/domain/usecases/survey/load-surveys-by-id"
import { mockSurvey } from "../domain"

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    public async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}
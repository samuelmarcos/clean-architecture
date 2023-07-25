import { SurveyModel } from "@/domain/models/survey"
import { LoadSurveys } from "@/domain/usecases/survey/load-surveys"
import { mockSurveys } from "../domain"

export const mockLoadSurveys = () => {
  class LoadSurveysStub implements LoadSurveys {
      public async load(): Promise<SurveyModel[]> {
          return new Promise((resolve) => resolve(mockSurveys()))
      }
  }

  return new LoadSurveysStub()
}



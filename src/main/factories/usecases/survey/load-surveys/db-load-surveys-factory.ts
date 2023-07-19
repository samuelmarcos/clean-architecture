import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'

export const makeSaveSurveyResult = (): SaveSurveyResult => {
    const surveyResultMongoRepository = new SurveyResultMongoRepository()
    return new DbSaveSurveyResult(surveyResultMongoRepository)

} 
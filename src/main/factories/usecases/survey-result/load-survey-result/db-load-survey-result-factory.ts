import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result.ts/db-load-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export const makeLoadSurveyResult = (): LoadSurveyResult => {
    const surveyResultMongoRepository = new SurveyResultMongoRepository()
    const surveyongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveyResult(surveyResultMongoRepository, surveyongoRepository)
} 
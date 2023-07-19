import { LoadSurveyById } from '@/domain/usecases/survey/load-surveys-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyById } from '@/data/usecases/survey/load-surveys-by-id/db-load-surveys-by-id'

export const makeDbLoadSeurveyById = (): LoadSurveyById => {
    const surveyResultMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveyById(surveyResultMongoRepository)

} 
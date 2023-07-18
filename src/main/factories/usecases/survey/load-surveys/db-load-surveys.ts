import { AddSurvey } from '../../../../../domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from '../../../../../data/usecases/survey/add-survey/db-add-survey'
import { LoadSurveys } from '../../../../../domain/usecases/survey/load-surveys'
import { DbLoadSurveys } from '../../../../../data/usecases/survey/load-surveys/db-load-surveys'

export const makeDbLoadSurveys = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()
    return new DbLoadSurveys(surveyMongoRepository)

} 
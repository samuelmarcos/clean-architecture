import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
    public async add(surveyData: AddSurveyModel): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        const result = await accountCollection.insertOne(surveyData)
        return MongoHelper.map(result.ops[0])
    }
}
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
    public async add(surveyData: AddSurveyModel): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        const result = await accountCollection.insertOne(surveyData)
        return MongoHelper.map(result.ops[0])
    }

    public async loadAll(): Promise<SurveyModel[]> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        const surveys: SurveyModel[] = await accountCollection.find().toArray()
        return surveys
    }
}
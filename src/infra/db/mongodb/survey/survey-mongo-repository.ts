import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
    public async add(surveyData: AddSurveyModel): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        const result = await accountCollection.insertOne(surveyData)
        return MongoHelper.map(result.ops[0])
    }

    public async loadAll(): Promise<SurveyModel[]> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        const surveys = await accountCollection.find().toArray()
        return surveys
    }

    public async loadById(id: string): Promise<SurveyModel> {
        const accountCollection = await MongoHelper.getCollection('surveys')
        const result = accountCollection.findOne({ _id: id })
        return result
    }
}
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey';
import { MongoHelper } from '../helpers/mongo-helper'
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
    public async add(surveyData: AddSurveyModel): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        await accountCollection.insertOne(surveyData)
    }

    public async loadAll(): Promise<SurveyModel[]> {
        const accountCollection = await MongoHelper.getCollection('surveys') 
        const surveys = await accountCollection.find().toArray()
        return MongoHelper.mapCollection(surveys)
    }

    public async loadById(id: string): Promise<SurveyModel> {
        const accountCollection = await MongoHelper.getCollection('surveys')
        const survey = accountCollection.findOne({ _id: new ObjectId(id) })
        return survey && MongoHelper.map(survey)
    }
}
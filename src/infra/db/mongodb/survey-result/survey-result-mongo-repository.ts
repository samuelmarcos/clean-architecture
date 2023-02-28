import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from "@/data/usecases/save-survey-result/db-save-survey-result-protocols";
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {

  public async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      account: data.accountId,
    }, {
      $set: { answer: data.answer, date: data.date }
    }, {
      upsert: true,
    })

    return res.value && MongoHelper.map(res.value)
  }
}
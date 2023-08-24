import { LoadSurveyResultRepository, LoadSurveyResult, SurveyResultModel, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {

  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
              private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  public async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if(surveyResult !== null) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0 
        }))
      }
    }

    return surveyResult!
  }
  
}
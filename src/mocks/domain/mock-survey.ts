import { SurveyModel } from "@/domain/models/survey"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result"

export const mockSurveys = (): SurveyModel[] => {
  return [
      {
          id: 'any_id',
          question: 'any_question',
          answers: [{
              image: 'any_image',
              answer: 'any_answer'
          }],
          date: new Date()
      },

      {
          id: 'other_id',
          question: 'other_id',
          answers: [{
              image: 'other_id',
              answer: 'other_id'
          }],
          date: new Date()
      }
  ]
} 


export const mockSurvey = (): SurveyModel => {
  return {
      id: 'any_id',
      question: 'any_question',
      answers: [{
          image: 'any_image',
          answer: 'any_answer'
      }],
      date: new Date()
  }
}

export const mockSurveyResult = (): SurveyResultModel => Object.assign({}, mockSurveyResultData() , {
  id: 'any_id'
})


export const mockSurveyResultData = (): SaveSurveyResultParams => {
  return {
      surveyId: 'any_id',
      accountId: 'any_id',
      answer: 'any_answer',
      date: new Date()
  }
}
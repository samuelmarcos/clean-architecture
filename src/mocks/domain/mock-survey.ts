import { SurveyModel } from "@/domain/models/survey"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result"
import { AddSurveyParams } from "@/domain/usecases/survey/add-survey"

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

export const mockSurveyResultParams = (): SaveSurveyResultParams => {
  return {
      surveyId: 'any_id',
      accountId: 'any_id',
      answer: 'any_answer',
      date: new Date()
  }
}

export const mockSurveyResult = (): SurveyResultModel => {
  return {
    surveyId: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer : 'any_answer',
      count: 0,
      percent: 0
    },
    {
      image: 'any_image',
      answer : 'any_answer',
      count: 0,
      percent: 0
    }],
    date: new Date()
  }
}

export const mockAddFakeSurveyParams = (): AddSurveyParams => {
  return {
      question: 'any_question',
      answers: [{
          image: 'any_image',
          answer : 'any_answer'
      }],
      date: new Date()
  }
}

import { SurveyModel } from "@/domain/models/survey"

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
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-surveys-by-id'
import { SurveyModel, LoadSurveyByIdRepository } from './db-load-surveys-by-id-protocols'

const makeFakeSurvey = (): SurveyModel => {
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

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}


const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveyByIdRepository {
      async loadById(id: string): Promise<SurveyModel> {
          return new Promise(resolve => {
              resolve(makeFakeSurvey())
          })
      }
  }

  return new LoadSurveysRepositoryStub()
}


const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}


describe('DbLoadSurveyById', () => {

  beforeAll(() => {
      MockDate.set(new Date())
  })

  afterAll(() => {
      MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
      const { sut, loadSurveyByIdRepositoryStub } = makeSut()
      const loadAllSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      await sut.loadById('any_id')
      expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })

  test('should throws if Decrypter throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub , 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.loadById('any_id')
    expect(promise).rejects.toThrow()
  })
})
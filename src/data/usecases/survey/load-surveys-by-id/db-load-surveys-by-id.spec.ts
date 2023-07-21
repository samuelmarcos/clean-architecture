import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-surveys-by-id'
import { LoadSurveyByIdRepository } from './db-load-surveys-by-id-protocols'
import { throwError } from '@/mocks/helpers'
import { mockLoadSurveyByIdRepository } from '@/mocks/data/db'
import { mockSurvey } from '@/mocks/domain'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
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
    expect(survey).toEqual(mockSurvey())
  })

  test('should throws if Decrypter throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub , 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    expect(promise).rejects.toThrow()
  })
})
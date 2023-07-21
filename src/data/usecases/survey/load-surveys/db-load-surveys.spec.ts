import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import { DbLoadSurveys } from "./db-load-surveys"
import MockDate from 'mockdate'
import { throwError } from '@/mocks/helpers'
import { mockLoadSurveysRepository } from '@/mocks/data/db'
import { mockSurveys } from '@/mocks/domain'

type SutTypes = {
    sut: DbLoadSurveys
    loaddSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
    const loaddSurveysRepositoryStub = mockLoadSurveysRepository()
    const sut = new DbLoadSurveys(loaddSurveysRepositoryStub)
    return { sut, loaddSurveysRepositoryStub }
}


describe('DbLoadSurveys', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveysRepository', async () => {
        const { sut, loaddSurveysRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loaddSurveysRepositoryStub, 'loadAll')
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test('Should return a list of surveys on success', async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(mockSurveys())
    })

    test('should throws if Decrypter throws', async () => {
        const { sut, loaddSurveysRepositoryStub } = makeSut()
        jest.spyOn(loaddSurveysRepositoryStub , 'loadAll').mockImplementationOnce(throwError)
        const promise = sut.load()
        expect(promise).rejects.toThrow()
    })
})
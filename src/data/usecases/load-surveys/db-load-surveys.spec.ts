import { SurveyModel } from "@/domain/models/survey"
import { LoadSurveysRepository } from "@/data/protocols/db/survey/load-surveys-repository"
import { DbLoadSurveys } from "./db-load-surveys"
import MockDate from 'mockdate'

type SutTypes = {
    sut: DbLoadSurveys
    loaddSurveysRepositoryStub: LoadSurveysRepository
}

const makeFakeSurveys = (): SurveyModel[] => {
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
const makeLoadSurveysRepositoryStub = () => {
    class LoaddSurveysRepositoryStub implements LoadSurveysRepository {
        async loadAll(): Promise<SurveyModel[]> {
            return new Promise(resolve => {
                resolve(makeFakeSurveys())
            })
        }
    }

    return new LoaddSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loaddSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
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
        expect(surveys).toEqual(makeFakeSurveys())
    })

    test('should throws if Decrypter throws', async () => {
        const { sut, loaddSurveysRepositoryStub } = makeSut()
        jest.spyOn(loaddSurveysRepositoryStub , 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.load()
        expect(promise).rejects.toThrow()
    })
})
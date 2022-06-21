import { SurveyModel } from "../../../presentation/controllers/survey/load-surveys/load-surveys-controller-protocols"
import { LoadSurveysRepository } from "../../protocols/db/survey/load-surveys-repository"
import { DbLoadSurveys } from "./db-load-surveys"

interface SutTypes {
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
    test('Should call LoadSurveysRepository', async () => {
        const { sut, loaddSurveysRepository } = makeSut()
        const loadAllSpy = jest.spyOn(loaddSurveysRepository, 'loadAll')
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })
})
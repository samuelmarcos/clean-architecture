import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SaveSurveyResultModel, SurveyResultModel } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

describe('DbSaveSurveyResult UseCase', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    const makeFakeSurveyResultData = (): SaveSurveyResultModel => {
      return {
          surveyId: 'any_id',
          accountId: 'any_id',
          answer: 'any_answer',
          date: new Date()
      }
    }

    const makeFakeSurveyResultModel = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData() , {
      id: 'any_id'
    })


    type SutTypes =  {
        sut: DbSaveSurveyResult
        saveSurveyResultRepositoryStub: SaveSurveyResultRepository
    }

    const makeSut = (): SutTypes => {
        const saveSurveyResultRepositoryStub =  makeSaveResultSurveyRepositoryStub()
        const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

        return { sut, saveSurveyResultRepositoryStub }
    }

    const makeSaveResultSurveyRepositoryStub = () => {
        class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
            public async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
                return new Promise((resolve) => {
                    resolve(makeFakeSurveyResultModel())
                })
            }
        }

        return new SaveSurveyResultRepositoryStub()
    }

  
    test('should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub , 'save')
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('should throw if SaveSurveyResultRepository throws', async () => {
        const { saveSurveyResultRepositoryStub, sut } = makeSut()
       
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise =  sut.save(makeFakeSurveyResultModel())
        await expect(promise).rejects.toThrow()
    })
})
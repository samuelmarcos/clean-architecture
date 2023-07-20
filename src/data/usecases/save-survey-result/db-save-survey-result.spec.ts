import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SaveSurveyResultParams, SurveyResultModel } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

describe('DbSaveSurveyResult UseCase', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    const makeFakeSurveyResultData = (): SaveSurveyResultParams => {
      return {
          surveyId: 'any_id',
          accountId: 'any_id',
          answer: 'any_answer',
          date: new Date()
      }
    }

    const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData() , {
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
            public async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
                return new Promise((resolve) => {
                    resolve(makeFakeSurveyResult())
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
        const promise = sut.save(makeFakeSurveyResult())
        await expect(promise).rejects.toThrow()
    })

    test('Should return a survey on success', async () => {
      const { sut } = makeSut()
      const surveyResultData = await sut.save(makeFakeSurveyResultData())
      expect(surveyResultData).toEqual(makeFakeSurveyResult())
    })
})
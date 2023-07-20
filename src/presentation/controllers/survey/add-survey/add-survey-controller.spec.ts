import { HttpRequest, Validation, AddSurvey, AddSurveyParams } from "./add-survey-controller-protocols"
import { AddSurveyController } from '../add-survey/add-survey-controller'
import { badRequest, noContent, serverError } from "@/presentation/helpers/http/http-helper"
import MockDate from 'mockdate'

describe('AddSurvey Controller', () => {

    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    type SutTypes = {
        sut: AddSurveyController
        validationStub: Validation
        addSurveyStub: AddSurvey
    }

    const makeFakeRequest = (): HttpRequest => {
        return {
            body: {
                question: 'any_question',
                answers: [{
                    image: 'any_image',
                    answer: 'any_answer'
                }],
                date: new Date()
            }
        }
    }

    const makeSut = (): SutTypes => {
        const validationStub = makeValidationStub()
        const addSurveyStub = makeAddSurveyStub()
        const sut = new AddSurveyController(validationStub, addSurveyStub)
        return { sut, validationStub, addSurveyStub }
    }

    const makeAddSurveyStub = (): AddSurvey => {
        class AddSurveyStub implements AddSurvey {
            async add(data: AddSurveyParams): Promise<void> {
                return new Promise((resolve) => resolve())
            }
        }

        return new AddSurveyStub()
    }

    const makeValidationStub = (): Validation => {
        class ValidationStub implements Validation {
            validate(input: any): any {
                return null
            }
        }

        return new ValidationStub()
    }
    
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const httpResquest = makeFakeRequest()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        await sut.handle(httpResquest)
        expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
    })

    test('should return 400 if validations fails', async () => {
        const { sut, validationStub } = makeSut()
        const httpResquest = makeFakeRequest()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const hhtpResponse = await sut.handle(httpResquest)
        expect(hhtpResponse).toEqual(badRequest(new Error()))
    })

    test('should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const httpResquest = makeFakeRequest()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        await sut.handle(httpResquest)
        expect(addSpy).toHaveBeenCalledWith(httpResquest.body)
    })

    test('should return 500 if add survey throws', async () => {
        const { sut, addSurveyStub } = makeSut()
        const httpResquest = makeFakeRequest()
        jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle(httpResquest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 204 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(noContent())
    })
})
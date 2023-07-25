import { HttpRequest, Validation, AddSurvey } from "./add-survey-controller-protocols"
import { AddSurveyController } from '../add-survey/add-survey-controller'
import { badRequest, noContent, serverError } from "@/presentation/helpers/http/http-helper"
import MockDate from 'mockdate'
import { throwError } from '@/mocks/helpers'
import { mockValidation } from "@/mocks/validation"
import { mockAddSurvey } from "@/mocks/presentation/mock-add-survey"

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

    const mockRequest = (): HttpRequest => {
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
        const validationStub = mockValidation()
        const addSurveyStub = mockAddSurvey()
        const sut = new AddSurveyController(validationStub, addSurveyStub)
        return { sut, validationStub, addSurveyStub }
    }

    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const httpResquest = mockRequest()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        await sut.handle(httpResquest)
        expect(validateSpy).toHaveBeenCalledWith(httpResquest.body)
    })

    test('should return 400 if validations fails', async () => {
        const { sut, validationStub } = makeSut()
        const httpResquest = mockRequest()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const hhtpResponse = await sut.handle(httpResquest)
        expect(hhtpResponse).toEqual(badRequest(new Error()))
    })

    test('should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const httpResquest = mockRequest()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        await sut.handle(httpResquest)
        expect(addSpy).toHaveBeenCalledWith(httpResquest.body)
    })

    test('should return 500 if add survey throws', async () => {
        const { sut, addSurveyStub } = makeSut()
        const httpResquest = mockRequest()
        jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(httpResquest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 204 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(noContent())
    })
})
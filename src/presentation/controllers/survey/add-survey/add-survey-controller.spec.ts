import { HttpRequest, Validation } from "./add-survey-controller-protocols"
import { AddSurveyController } from '../add-survey/add-survey-controller'

describe('AddSurvey Controller', () => {

    interface SutTypes {
        sut: AddSurveyController
        validationStub: Validation
    }

    const makeFakeRequest = (): HttpRequest => {
        return {
            body: {
                question: 'any_question',
                answers: [{
                    image: 'any_image',
                    answer: 'any_answer'
                }]
            }
        }
    }

    const makeSut = (): SutTypes => {
        const validationStub = makeValidationStub()
        const sut = new AddSurveyController(validationStub)
        return { sut, validationStub }
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
})
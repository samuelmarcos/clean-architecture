import { MissingParamError } from "@/presentation/errors"
import { Validation } from "@/presentation/protocols"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
    sut: ValidationComposite
    validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
    const validationStubs = [makeValidationStub(), makeValidationStub()]
    const sut = new ValidationComposite( validationStubs )
    return {
        sut,
        validationStubs
    }
}

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: string): any {
             return null
        }
    }
    return new ValidationStub()
}


describe('Validation Composite', () => {
    test('should return an error if any validation fails', () => {
        const { sut, validationStubs} = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('should return the first error if more then one validation fails', () => {
        const { sut, validationStubs} = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new Error())
    })

    test('should not returns if validation succeeds', () => {
        const { sut} = makeSut()
        const error = sut.validate({ field: 'any_value' })
        expect(error).toBeFalsy()
    })
})
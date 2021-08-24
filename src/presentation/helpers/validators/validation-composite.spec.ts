import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
    sut: ValidationComposite
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new ValidationComposite([ validationStub ])
    return {
        sut,
        validationStub
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
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})
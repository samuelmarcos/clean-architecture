import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"


const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: string): Error {
             return new MissingParamError('field')
        }
    }
    return new ValidationStub()
}


describe('Validation Composite', () => {
    test('should return an error if any validation fails', () => {
        const sut = new ValidationComposite([ makeValidationStub() ])
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})
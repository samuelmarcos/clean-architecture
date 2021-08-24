import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

describe('Required Field Validation', () => {
    test('should return a minssing param error if validation fails', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})
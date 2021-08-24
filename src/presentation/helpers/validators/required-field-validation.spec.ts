import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

const makeSut = () => {
    return new RequiredFieldValidation('field')
}

describe('Required Field Validation', () => {
    test('should return a missing param error if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('should not return if validation success', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_name' })
        expect(error).toBeFalsy()
    })
})
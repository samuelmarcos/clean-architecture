import { InvalidParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

const makeSut = () => {
    return new CompareFieldsValidation('field', 'field_to_compare')
}

describe('Required Field Validation', () => {
    test('should return a invalid param error if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_name', field_to_compare: 'wrong_value' })
        expect(error).toEqual(new InvalidParamError('field_to_compare'))
    })

    test('should not return if validation success', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_name', field_to_compare: 'any_name' })
        expect(error).toBeFalsy()
    })
})
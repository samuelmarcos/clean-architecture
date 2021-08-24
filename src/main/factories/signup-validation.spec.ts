import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
    test('should call validatio composite with all validations', () => {
        makeSignupValidation()
        const validations : Validation[] = []
        for(const field of ['name', 'email', 'password', 'password_confirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new CompareFieldsValidation('password', 'password_confirmation'))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
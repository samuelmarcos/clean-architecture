
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'

export const makeSignupValidation = (): ValidationComposite => {
    const validations : Validation[] = []
    for(const field of ['name', 'email', 'password', 'password_confirmation']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'password_confirmation'))

    return new ValidationComposite(validations)
} 
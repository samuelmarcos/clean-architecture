
import { RequiredFieldValidation } from '../../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../adpaters/validators/email-validator.adapter'

export const makeLoginValidation = (): ValidationComposite => {
    const validations : Validation[] = []
    for(const field of ['password', 'email']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
} 
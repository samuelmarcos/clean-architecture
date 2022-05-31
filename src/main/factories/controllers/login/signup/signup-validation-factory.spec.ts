
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { makeSignupValidation } from './signup-validation-factory'


const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
    test('should call validatio composite with all validations', () => {
        makeSignupValidation()
        const validations : Validation[] = []
        for(const field of ['name', 'email', 'password', 'password_confirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'password_confirmation'))
        validations.push(new EmailValidation('email', makeEmailValidatorStub( )))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
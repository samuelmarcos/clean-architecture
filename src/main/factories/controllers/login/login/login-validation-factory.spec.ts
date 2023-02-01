
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { makeLoginValidation } from './login-validation-factory'


const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

jest.mock('@/validators/validators/validation-composite')

describe('Login Validation Factory', () => {
    test('should call validatio composite with all validations', () => {
        makeLoginValidation()
        const validations : Validation[] = []
        for(const field of ['password', 'email']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new EmailValidation('email', makeEmailValidatorStub( )))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true
    }
}))

describe('Email Validator Adapter', () => {
    test('should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const invalidEmail = sut.isValid('invalid_email@email.com')
        expect(invalidEmail).toBe(false)
    })

    test('should return true if validator returns true', () => {
        const sut = new EmailValidatorAdapter()
        const invalidEmail = sut.isValid('valid_email@email.com')
        expect(invalidEmail).toBe(true)
    })
})
import { EmailValidatorAdapter } from './email-validator'

describe('Email Validator Adapter', () => {
    test('should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter()
        const invalidEmail = sut.isValid('invalid_email@email.com')
        expect(invalidEmail).toBe(false)
    })
})
import { EmailValidatorAdapter } from './email-validator.adapter'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail(): boolean {
        return true
    }
}))

const makeSut = () : EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
    test('should return false if validator returns false', () => {
        const sut = makeSut()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const invalidEmail = sut.isValid('invalid_email@email.com')
        expect(invalidEmail).toBe(false)
    })

    test('should return true if validator returns true', () => {
        const sut = makeSut()
        const invalidEmail = sut.isValid('valid_email@email.com')
        expect(invalidEmail).toBe(true)
    })

    test('should clall email validator with correct email', () => {
        const sut =makeSut()
        const spied = jest.spyOn(validator, 'isEmail')
        sut.isValid('any-email@email.com')
        expect(spied).toHaveBeenCalledWith('any-email@email.com')
    })
})
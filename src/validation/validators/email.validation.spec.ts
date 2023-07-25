import { EmailValidation } from "./email-validation"
import { EmailValidator } from '../protocols/email-validator'
import { mockEmailValidator } from '@/mocks/validation'

type SutTypes = {
    sut: EmailValidation,
    emailValidatoStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatoStub = mockEmailValidator()
   
    const sut = new EmailValidation('email', emailValidatoStub)

    return {sut, emailValidatoStub }
}

describe('Email Validation', () => {
    test('should call EmailValidator with correct email', () => {
        const { sut, emailValidatoStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatoStub, 'isValid')

        sut.validate({ email : "any_email@email.com" })
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('should return 500 if EmailValidator throws', () => {
        const { sut, emailValidatoStub } = makeSut()

        jest.spyOn(emailValidatoStub, 'isValid').mockImplementationOnce(() => {throw new Error()})
        expect(sut.validate).toThrow()
        
    })
})
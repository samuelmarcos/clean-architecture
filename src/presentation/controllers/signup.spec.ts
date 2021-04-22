import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { SignUpController } from "./signup"
import { EmailValidator} from '../protocols/email-validator'

interface SutTypes {
    sut: SignUpController,
    emailValidatoStub: EmailValidator
}

const makeSut = () => {
    const emailValidatoStub = makeEmailValidatorStub()
    const sut = new SignUpController(emailValidatoStub)

    return {sut, emailValidatoStub}
}

const makeEmailValidatorStub = () => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('Signup Controller', () => {
    test('should return 400 if no name is provided', () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                email: 'any_email@email.com.br',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no name is provided', () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no name is provided', () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no name is provided', () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
    })

    test('should return 400 if invalid email is provided', () => {
        const { sut, emailValidatoStub } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_email',
                email: 'invalid_email',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        jest.spyOn(emailValidatoStub, 'isValid').mockReturnValueOnce(false)

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
})
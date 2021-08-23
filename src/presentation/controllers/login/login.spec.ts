import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { LoginController } from './login'


interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}

const makeFakeHttpRequest = (): HttpRequest => {
    return {
        body: {
            email: 'any_email@email.com',
            password: 'any_password'
        }

    }
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {

    const emailValidatorStub = makeEmailValidatorStub()

    const sut = new LoginController(emailValidatorStub)

    return {
        sut,
        emailValidatorStub
    }
}

describe('Login Controller',() => {
    test('should return 400 with no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))

    })

    test('should return 400 with no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@email.com'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))

    })

    test('should call Email validator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        await sut.handle(makeFakeHttpRequest())
        expect(isValidSpy).toHaveBeenLastCalledWith('any_email@email.com')
    })

    test('should 400 if a invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))

    })
})


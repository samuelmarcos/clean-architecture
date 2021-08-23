import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest, Authentication } from './login-protocols'
import { LoginController } from './login'
import { rejects } from 'node:assert'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
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

const makeAuthenticationStub = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(email: string, password: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }

    return new AuthenticationStub()
}

const makeSut = (): SutTypes => {

    const emailValidatorStub = makeEmailValidatorStub()

    const authenticationStub = makeAuthenticationStub()

    const sut = new LoginController(emailValidatorStub, authenticationStub)

    return {
        sut,
        emailValidatorStub,
        authenticationStub
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

    test('should 500 if email validador throws', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))

    })

    test('should call athentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const authSpy = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(makeFakeHttpRequest())
        expect(authSpy).toHaveBeenLastCalledWith('any_email@email.com', 'any_password')
    })

    test('should 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => resolve('')))

        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(unauthorized())

    })

    test('should 500 if authrntivation throws', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => {reject(new Error())}))

        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))

    })
})


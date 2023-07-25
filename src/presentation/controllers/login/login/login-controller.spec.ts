import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Validation , HttpRequest, Authentication } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { mockAuthentication } from '@/mocks/presentation'
import { mockValidation } from '@/mocks/validation'

type SutTypes = {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
}

const mockRequest = (): HttpRequest => {
    return {
        body: {
            email: 'any_email@email.com',
            password: 'any_password'
        }

    }
}

const makeSut = (): SutTypes => {
    const authenticationStub = mockAuthentication()
    const validationStub = mockValidation()

    const sut = new LoginController(authenticationStub, validationStub)

    return {
        sut,
        authenticationStub,
        validationStub
    }
}

describe('Login Controller',() => {
    test('should call athentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const authSpy = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenLastCalledWith({ email: 'any_email@email.com', password: 'any_password' })
    })

    test('should 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => resolve('')))

        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(unauthorized())

    })

    test('should 500 if authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => {reject(new Error())}))

        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))

    })

    test('should 200 if credentials are provided', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({acccessToken: "any_token"}))

    })

    test('should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')

        const httpRequest = mockRequest()

        await sut.handle(httpRequest)
        
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})


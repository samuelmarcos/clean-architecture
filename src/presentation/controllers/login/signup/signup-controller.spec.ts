import { MissingParamError, ServerError, EmailInUseError } from "@/presentation/errors"
import { SignUpController } from "./signup-controller"
import { AddAccount,Validation, Authentication } from './signup-controller-protocols'
import { HttpRequest } from "@/presentation/protocols"
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { mockValidation } from "@/mocks/validation"
import { mockAuthentication } from "@/mocks/presentation"
import { mockAddAccount } from "@/mocks/presentation/mock-add-account"

type SutTypes = {
    sut: SignUpController,
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const addAccountStub = mockAddAccount()
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

    return { sut, addAccountStub, validationStub, authenticationStub }
} 

const mockRequest = (): HttpRequest => {
    return {
        body: {
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
            password_confirmation: 'any_password',
        }
    }
}

describe('Signup Controller', () => {
    test('should call AddAccount with correct email', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')

        await sut.handle(mockRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
        })
    })

    test('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { return new Promise((resolve, reject) => reject(new Error()))})

        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
    })

    test('should return 403 if AddAccount returns null', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Promise((resolve)=> resolve(null)))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })

    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token'}))
    })

    test('should call Validation with correct email', async () => {
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

    test('should call athentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const authSpy = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenLastCalledWith({ email: 'any_email@email.com', password: 'any_password' })
    })

    test('should 500 if authrntivation throws', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => {reject(new Error())}))

        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))

    })

})
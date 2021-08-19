import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { SignUpController } from "./signup"
import { AddAccount, AddAccountModel,AccountModel, EmailValidator } from '../signup/signup-protocols'
import { HttpRequest } from "../../protocols"
import { ok, serverError, badRequest } from '../../helpers/http-helper'

interface SutTypes {
    sut: SignUpController,
    emailValidatoStub: EmailValidator
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatoStub = makeEmailValidatorStub()
    const addAccountStub = makeAddAccountStub()
    const sut = new SignUpController(emailValidatoStub, addAccountStub)

    return {sut, emailValidatoStub, addAccountStub }
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => {
    return {
        body: {
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
            password_confirmation: 'any_password',
        }
    }
}

const makeAddAccountStub = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_passeword'
    }
}

describe('Signup Controller', () => {
    test('should return 400 if no name is provided', async () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                email: 'any_email@email.com.br',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    })

    test('should return 400 if no name is provided', async () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('should return 400 if no password is provided', async () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('should return 400 if no password confirmation is provided', async () => {
        const {sut} = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password_confirmation')))
    })

    test('should return 400 if  password confirmation fails', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                password_confirmation: 'invalid password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('password_confirmation')))
    })

    test('should return 400 if invalid email is provided', async () => {
        const { sut, emailValidatoStub } = makeSut()
        jest.spyOn(emailValidatoStub, 'isValid').mockReturnValueOnce(false)

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatoStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatoStub, 'isValid')

        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatoStub } = makeSut()

        jest.spyOn(emailValidatoStub, 'isValid').mockImplementationOnce(() => {throw new Error()})
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
    })

    test('should call AddAccount with correct email', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')

        await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
        })
    })

    test('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { return new Promise((resolve, reject) => reject(new Error()))})

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
    })

    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })
})
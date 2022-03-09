import { InvalidParamError, MissingParamError, ServerError } from "../../errors"
import { SignUpController } from "./signup-controller"
import { AddAccount, AddAccountModel,AccountModel, Validation } from './signup-controller-protocols'
import { HttpRequest } from "../../protocols"
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'

interface SutTypes {
    sut: SignUpController,
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccountStub()
    const validationStub = makeValidationStub()
    const sut = new SignUpController(addAccountStub, validationStub)

    return {sut, addAccountStub, validationStub }
}

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): any {
            return null
        }
    }

    return new ValidationStub()
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

    test('should call Validation with correct email', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})
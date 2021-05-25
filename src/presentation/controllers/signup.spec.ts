import { InvalidParamError, MissingParamError, ServerError } from "../errors"
import { SignUpController } from "./signup"
import { EmailValidator} from '../protocols'
import { AddAccount, AddAccountModel } from '../domain/usecases/add-account'
import { AccountModel } from '../domain/models/account'

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

const makeAddAccountStub = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        add(account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_passeword'
            }
            return fakeAccount;
        }
    }
    return new AddAccountStub()
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

    test('should return 400 if no password is provided', () => {
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

    test('should return 400 if no password confirmation is provided', () => {
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

    test('should return 400 if  password confirmation fails', () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                password_confirmation: 'invalid password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'))
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

    test('should call EmailValidator with correct email', () => {
        const { sut, emailValidatoStub } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_email',
                email: 'any_email@email.com',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const isValidSpy = jest.spyOn(emailValidatoStub, 'isValid')

        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('should return 500 if EmailValidator throws', () => {
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

    test('should return 500 if EmailValidator throws', () => {
        const { sut, emailValidatoStub } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_email',
                email: 'invalid_email',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        jest.spyOn(emailValidatoStub, 'isValid').mockImplementationOnce(() => {throw new Error()})
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('should call AddAccount with correct email', () => {
        const { sut, addAccountStub } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                password_confirmation: 'any_password'
            }
        }
        const addSpy = jest.spyOn(addAccountStub, 'add')

        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password',
        })
    })
})
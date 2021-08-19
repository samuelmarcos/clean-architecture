import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-respository'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => resolve({
                statusCode: 200,
                body: {
                    name: 'any_name',
                    email: 'any_email@email.com.br',
                    password: 'any_password',
                }
            }))
        }
    }

    return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes =>  {
    const controllerStub = makeControllerStub()
    const logErrorRepositoryStub = makeLogErrorRepositoryStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

describe('Log Decorator', ()=> {
    test('should call controller handle', async () => {
        
        const { sut, controllerStub } = makeSut()

        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: 'any_password',
                password_confirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    }) 
    
    test('should return the same result of the controller', async () => {
        
        const { sut, controllerStub } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: 'any_password',
                password_confirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: 'any_password',
            }
        })
    }) 

    test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
        
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve => resolve(error))))

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: 'any_password',
                password_confirmation: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    }) 
})
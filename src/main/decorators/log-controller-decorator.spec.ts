import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log-controller-decorator"
import { serverError, ok } from '@/presentation/helpers/http/http-helper'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-respository'
import { AccountModel } from "@/domain/models/account"

type SutTypes = {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
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

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_passeword'
    }
}

const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => resolve(ok(makeFakeAccount())))
        }
    }

    return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError(stack: string): Promise<void> {
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
        
        await sut.handle(makeFakeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    }) 
    
    test('should return the same result of the controller', async () => {
        
        const { sut, controllerStub } = makeSut()

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    }) 

    test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
        
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve => resolve(makeServerError()))))

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
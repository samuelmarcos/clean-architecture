import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
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

const makeSut = (): SutTypes =>  {
    const controllerStub = makeControllerStub()
    const sut  = new LogControllerDecorator(controllerStub)

    return {
        sut,
        controllerStub
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
    
    test('should retur the same result of the controller', async () => {
        
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
})
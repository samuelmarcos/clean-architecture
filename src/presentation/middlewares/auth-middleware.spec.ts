import { AccessDeniedError } from '../errors'
import { forbidden } from "../helpers/http/http-helper"
import { HttpRequest } from "../protocols"
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
    sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
    const sut = new AuthMiddleware()

    return { sut }
}

const makeFakeRequest = (): HttpRequest => {
    return {
        headers: {}
    }
}


describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in header', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })
})
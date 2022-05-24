import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from "../helpers/http/http-helper"
import { HttpRequest } from "../protocols"
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    return { sut, loadAccountByTokenStub }
}

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_password'
    }
}

const makeLoadAccountByTokenStub = () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        public async load(accessToken: string, role?: string): Promise<AccountModel | null> {
            return new Promise((resolve) => {
                resolve(makeFakeAccount())
            })
        }
    }   

    return new LoadAccountByTokenStub()
}

const makeFakeRequest = (): HttpRequest => {
    return {
        headers: {}
    }
}

const makeRequest = (): HttpRequest => {
    return {
        headers: {
            'x-access-token': 'access-token'
        }
    }
}


describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in header', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should call LoadAccountByToken with correct accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        await sut.handle(makeRequest())
        const loadSpy = jest.spyOn(loadAccountByTokenStub , 'load')
        expect(loadSpy).toHaveBeenCalledWith('access-token')
        
    })

    test('Should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => {resolve(null)}))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should return 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({ accountId: 'valid_id'}))
    })
})
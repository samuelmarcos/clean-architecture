import { LoadAccountByToken, HttpRequest, AccountModel } from './auth-middlewares-protocols'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from "@/presentation/helpers/http/http-helper"
import { AuthMiddleware } from './auth-middleware'
import { mockAccountModel } from '@/mocks/domain/index'

type SutTypes = {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role!)
    return { sut, loadAccountByTokenStub }
}


const makeLoadAccountByTokenStub = () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        public async load(accessToken: string, role?: string): Promise<AccountModel | null> {
            return new Promise((resolve) => {
                resolve(mockAccountModel())
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
        const role = 'any_role'
        const { sut, loadAccountByTokenStub } = makeSut(role)
        await sut.handle(makeRequest())
        const loadSpy = jest.spyOn(loadAccountByTokenStub , 'load')
        expect(loadSpy).toHaveBeenCalledWith('access-token', role)
        
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
        expect(httpResponse).toEqual(ok({ accountId: 'any_id'}))
    })

    test('Should return 200 if LoadAccountByToken throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error())}))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
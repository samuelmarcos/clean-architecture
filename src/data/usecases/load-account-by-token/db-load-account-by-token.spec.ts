
import { Decrypter, LoadAccoountByTokenRepository, AccountModel, LoadAccountByToken } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { throwError } from '@/mocks/helpers'

type SutTypes = {
    sut: LoadAccountByToken
    decrypterStub: Decrypter
    loadAccoountByTokenRepositoryStub: LoadAccoountByTokenRepository
}

const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const loadAccoountByTokenRepositoryStub = makeLoadAccoountByTokenRepositoryStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccoountByTokenRepositoryStub)
    return { sut, decrypterStub, loadAccoountByTokenRepositoryStub }
}

const makeDecrypterStub = () => {
    class DecrypterStub implements Decrypter {
        async decrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('any_value'))
        }
    }
    return new DecrypterStub()
}

const makeLoadAccoountByTokenRepositoryStub = () => {
    class LoadAccoountByTokenRepositoryStub implements LoadAccoountByTokenRepository {
        loadByToken(token: string, role?: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccoountByTokenRepositoryStub()
}

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_password'
    }
}

describe('DbLoadAccountByToken UseCase', () => {
    test('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub , 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    test('should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub , 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    test('should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccoountByTokenRepositoryStub } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccoountByTokenRepositoryStub , 'loadByToken')
        await sut.load('any_token', 'any_role')
        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
    })

    test('should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccoountByTokenRepositoryStub } = makeSut()
        jest.spyOn(loadAccoountByTokenRepositoryStub , 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    test('should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.load('any_token', 'any_role')
        expect(account).toEqual(makeFakeAccount())
    })

    test('should throws if Decrypter throws', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub , 'decrypt').mockImplementationOnce(throwError)
        const promise = sut.load('any_token', 'any_role')
        expect(promise).rejects.toThrow()
    })

    test('should throws if Decrypter throws', async () => {
        const { sut, loadAccoountByTokenRepositoryStub } = makeSut()
        jest.spyOn(loadAccoountByTokenRepositoryStub , 'loadByToken').mockImplementationOnce(throwError)
        const promise = sut.load('any_token', 'any_role')
        expect(promise).rejects.toThrow()
    })

})
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
    sut: LoadAccountByToken
    decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return { sut, decrypterStub }
}

const makeDecrypterStub = () => {
    class DecrypterStub implements Decrypter {
        async decrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('any_value'))
        }
    }
    return new DecrypterStub()
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
})
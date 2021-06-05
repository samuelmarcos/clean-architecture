import { DbAddAccount } from '../add-account/db-add-account'
import { Encrypter } from './db-add-account-protocols'

interface SutTypes {
    encryptStub: Encrypter
    sut: DbAddAccount
}

const makeSut = () : SutTypes => {
    const encryptStub = makeEncrypterStub()
    const sut = new DbAddAccount(encryptStub)

    return {
        sut,
        encryptStub
    }
}

const makeEncrypterStub = () => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string) : Promise<string> {
            return new Promise(resolve => resolve('hashed_value'))
        }
    }
    return new EncrypterStub()
}

describe('DbAddAccount usecase', () => {
    test('should call Encrypterwith correct password', async () => {
        const { encryptStub, sut } = makeSut()
       
        const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenLastCalledWith(accountData.password)
    })

    test('should throw if wncrypter throws', async () => {
        const { encryptStub, sut } = makeSut()
       
        jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        const promiseAccount =  sut.add(accountData)
        await expect(promiseAccount).rejects.toThrow()
    })
})
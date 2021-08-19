import { AddAccount } from '../../../presentation/domain/usecases/add-account'
import { DbAddAccount } from '../add-account/db-add-account'
import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'


interface SutTypes {
    encryptStub: Encrypter
    sut: DbAddAccount
    addAccountRepositoryStub: AddAccountRepository
}

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed_password'
    }
}

const makeFakeAccountData = (): AddAccountModel => {
    return {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
    }
}

const makeSut = () : SutTypes => {
    const encryptStub = makeEncrypterStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub)
    
    return {
        sut,
        encryptStub,
        addAccountRepositoryStub
    }
}

const makeEncrypterStub = () => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string) : Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

describe('DbAddAccount usecase', () => {
    test('should call Encrypter with correct password', async () => {
        const { encryptStub, sut } = makeSut()
       
        const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenLastCalledWith('valid_password')
    })

    test('should throw if encrypter throws', async () => {
        const { encryptStub, sut } = makeSut()
       
        jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promiseAccount =  sut.add(makeFakeAccount())
        await expect(promiseAccount).rejects.toThrow()
    })

    test('should call AddAccountRepository with correct values', async () => {
        const { addAccountRepositoryStub, sut } = makeSut()
       
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenLastCalledWith({
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        })
    })

    test('should throw if encrypter throws', async () => {
        const { addAccountRepositoryStub, sut } = makeSut()
       
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promiseAccount =  sut.add(makeFakeAccountData())
        await expect(promiseAccount).rejects.toThrow()
    })

    test('should return an account if on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })
})
import { AddAccount } from '../../../domain/usecases/add-account'
import { DbAddAccount } from '../add-account/db-add-account'
import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'


interface SutTypes {
    hasherStub: Hasher
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
    const hasherStub = makeHasherStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
    
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub
    }
}

const makeHasherStub = () => {
    class HasherStub implements Hasher {
        async hash(value: string) : Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
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
    test('should call Hasher with correct password', async () => {
        const { hasherStub, sut } = makeSut()
       
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenLastCalledWith('valid_password')
    })

    test('should throw if hasher throws', async () => {
        const { hasherStub, sut } = makeSut()
       
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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

    test('should throw if AddAccountRepository throws', async () => {
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
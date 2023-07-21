import { DbAddAccount } from './db-add-account'
import { Hasher, AddAccountRepository , LoadAccountByEmailRepository} from './db-add-account-protocols'
import { mockAccountModel, mockAddAccountParams} from '@/mocks/domain'
import { throwError } from '@/mocks/helpers'
import { mockHasher } from '@/mocks/data/cryptography'
import { mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/mocks/data/db'


type SutTypes = {
    hasherStub: Hasher
    sut: DbAddAccount
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    addAccountRepositoryStub: AddAccountRepository
}


const makeSut = () : SutTypes => {
    const hasherStub = mockHasher()
    const addAccountRepositoryStub = mockAddAccountRepository()
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
    
    return {
        sut,
        hasherStub,
        loadAccountByEmailRepositoryStub,
        addAccountRepositoryStub
    }
}


describe('DbAddAccount usecase', () => {
    test('should call Hasher with correct password', async () => {
        const { hasherStub, sut } = makeSut()
       
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(mockAddAccountParams())
        expect(encryptSpy).toHaveBeenLastCalledWith('any_password')
    })

    test('should throw if hasher throws', async () => {
        const { hasherStub, sut } = makeSut()
       
        jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
        const promiseAccount =  sut.add(mockAccountModel())
        await expect(promiseAccount).rejects.toThrow()
    })

    test('should call AddAccountRepository with correct values', async () => {
        const { addAccountRepositoryStub, sut } = makeSut()
       
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(mockAddAccountParams())
        expect(addSpy).toHaveBeenLastCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'hashed_password'
        })
    })

    test('should throw if AddAccountRepository throws', async () => {
        const { addAccountRepositoryStub, sut } = makeSut()
       
        jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
        const promiseAccount =  sut.add(mockAddAccountParams())
        await expect(promiseAccount).rejects.toThrow()
    })

    test('should return an account if on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(mockAddAccountParams())
        expect(account).toEqual(mockAccountModel())
    })

    test('should return null if LoadAccountByEmailRepository not returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(new Promise((resolve)=>{resolve(mockAccountModel())}))
        const account = await sut.add(mockAddAccountParams())
        expect(account).toBe(null)
    })

    test('should call LoadAccountByEmailRepository with correct email', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(mockAddAccountParams())
        expect(loadSpy).toHaveBeenLastCalledWith('any_email@email.com')
    })
})
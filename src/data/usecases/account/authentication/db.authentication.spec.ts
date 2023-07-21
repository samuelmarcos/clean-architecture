import { DbAuthentication } from './db.authentication'
import { 
    LoadAccountByEmailRepository, 
    Encrypter, 
    UpdateAcessTokenRepository, 
    HashCompare, 
    AthenticationParams } from "./db.authentication.protocols"
import { mockEncrypter } from '@/mocks/data/cryptography'
import { mockUpdateAcessTokenRepository, mockLoadAccountByEmailRepository } from '@/mocks/data/db'

type SutTypes = {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashCompareStub: HashCompare
    encrypterStub: Encrypter,
    updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeFakeAthenticationModel = (): AthenticationParams => {
    return {email: 'any_email@email.com', password: 'any_password'}
}

const makeHashCompareStub = (): HashCompare => {
    class HashCompareStub implements HashCompare {
        async compare(value: string, hash: string): Promise<boolean>{
            return new Promise(resolve => resolve(true))
        }
    }

    return new HashCompareStub()
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const hashCompareStub = makeHashCompareStub()
    const encrypterStub = mockEncrypter()
    const updateAcessTokenRepositoryStub = mockUpdateAcessTokenRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, encrypterStub, updateAcessTokenRepositoryStub)

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        encrypterStub,
        updateAcessTokenRepositoryStub
    }
}

describe('Db Athentication', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(makeFakeAthenticationModel())
        expect(loadSpy).toHaveBeenLastCalledWith(makeFakeAthenticationModel().email)
    })

    test('should throw if LoadAccountByEmailRepository throws', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.auth(makeFakeAthenticationModel())
        await expect(promise).rejects.toThrow()
    })

    test('should return null if LoadAccountByEmailRepository returns null', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject)=> resolve(null)))
        const accessToken = await sut.auth(makeFakeAthenticationModel())
        expect(accessToken).toBe(null)
    })

    test('should call HashCompare with correct values', async () => {

        const {sut, hashCompareStub} = makeSut()
        const compareSpy = jest.spyOn(hashCompareStub, 'compare')
        await sut.auth(makeFakeAthenticationModel())
        expect(compareSpy).toHaveBeenLastCalledWith('any_password', 'hashed_password')
    })

    test('should throw if HashCompare throws', async () => {

        const {sut, hashCompareStub} = makeSut()
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.auth(makeFakeAthenticationModel())
        await expect(promise).rejects.toThrow()
    })

    test('should return null if HashCompare returns false', async () => {

        const {sut, hashCompareStub} = makeSut()
        const loadSpy = jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject)=> resolve(false)))
        const accessToken = await sut.auth(makeFakeAthenticationModel())
        expect(accessToken).toBe(null)
    })

    test('should return a token on success', async () => {

        const {sut, encrypterStub} = makeSut()
        const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFakeAthenticationModel())
        expect(generateSpy).toHaveBeenLastCalledWith('any_id')
    })

    test('should throw if HashCompare throws', async () => {

        const {sut, encrypterStub} = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.auth(makeFakeAthenticationModel())
        await expect(promise).rejects.toThrow()
    })

    test('should call Encrypter returns a token os sucess', async () => {

        const {sut} = makeSut()
        const acess_token = await sut.auth(makeFakeAthenticationModel())
        expect(acess_token).toBe('any_token')
    })

    test('should call UpdateAcessTokenRepository with correct values', async () => {

        const {sut, updateAcessTokenRepositoryStub} = makeSut()
        const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(makeFakeAthenticationModel())
        expect(updateSpy).toHaveBeenLastCalledWith('any_id', 'any_token')
    })

    test('should throw if UpdateAcessTokenRepository throws', async () => {

        const {sut, updateAcessTokenRepositoryStub} = makeSut()
        jest.spyOn(updateAcessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.auth(makeFakeAthenticationModel())
        await expect(promise).rejects.toThrow()
    })
})
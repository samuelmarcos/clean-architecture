import { AccountModel } from "../add-account/db-add-account-protocols"
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAthentication } from './db.athentication'
import { AthenticationModel } from "../../../domain/usecases/authenctication"
import { HashCompare } from "../../protocols/cryptography/hash-compre"
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { UpdateAcessTokenRepository } from '../../protocols/db/update-access-token-repository'

interface SutTypes {
    sut: DbAthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashCompareStub: HashCompare
    tokenGeneratorStub: TokenGenerator,
    updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeFakeAthenticationModel = (): AthenticationModel => {
    return {email: 'any_email@email.com', password: 'any_password'}
}

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'hashed_password'
}
}

const makeHashCompareStub = (): HashCompare => {
    class HashCompareStub implements HashCompare {
        async compare(value: string, hash: string): Promise<boolean>{
            return new Promise(resolve => resolve(true))
        }
    }

    return new HashCompareStub()
}

const makeloadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string ): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(id: string ): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }

    return new TokenGeneratorStub()
}

const makeUpdateAcessTokenRepositoryStub = () => {
    class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
        async update(id: string , acess_token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new UpdateAcessTokenRepositoryStub()
}



const makeSut = (): SutTypes => {

    const loadAccountByEmailRepositoryStub = makeloadAccountByEmailRepositoryStub()
    const hashCompareStub = makeHashCompareStub()
    const tokenGeneratorStub = makeTokenGeneratorStub()
    const updateAcessTokenRepositoryStub = makeUpdateAcessTokenRepositoryStub()
    const sut = new DbAthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub, updateAcessTokenRepositoryStub)

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashCompareStub,
        tokenGeneratorStub,
        updateAcessTokenRepositoryStub
    }
}

describe('Db Athentication', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(makeFakeAthenticationModel())
        expect(loadSpy).toHaveBeenLastCalledWith(makeFakeAthenticationModel().email)
    })

    test('should throw if LoadAccountByEmailRepository throws', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.auth(makeFakeAthenticationModel())
        await expect(promise).rejects.toThrow()
    })

    test('should return null if LoadAccountByEmailRepository returns null', async () => {

        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject)=> resolve(null)))
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

    test('should call TokenGenerator with correct id', async () => {

        const {sut, tokenGeneratorStub} = makeSut()
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        await sut.auth(makeFakeAthenticationModel())
        expect(generateSpy).toHaveBeenLastCalledWith('any_id')
    })

    test('should throw if HashCompare throws', async () => {

        const {sut, tokenGeneratorStub} = makeSut()
        jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error)))
        const promise = sut.auth(makeFakeAthenticationModel())
        await expect(promise).rejects.toThrow()
    })

    test('should call TokenGenerator returns a token os sucess', async () => {

        const {sut} = makeSut()
        const acess_token = await sut.auth(makeFakeAthenticationModel())
        expect(acess_token).toBe('any_token')
    })

    test('should call UpdateAcessTokenRepository with correct values', async () => {

        const {sut, updateAcessTokenRepositoryStub} = makeSut()
        const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'update')
        await sut.auth(makeFakeAthenticationModel())
        expect(updateSpy).toHaveBeenLastCalledWith('any_id', 'any_token')
    })
})
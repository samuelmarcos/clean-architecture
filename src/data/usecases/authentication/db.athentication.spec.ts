import { AccountModel } from "../add-account/db-add-account-protocols"
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAthentication } from './db.athentication'
import { AthenticationModel } from "../../../domain/usecases/authenctication"

const makeFakeAthenticationModel = (): AthenticationModel => {
    return {email: 'any_email@email.com', password: 'any_password'}
}

const makeloadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string ): Promise<AccountModel> {
            const account: AccountModel = {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password'
            }
            return new Promise(resolve => resolve(account))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeSut = () => {
    const sut = new DbAthentication()

    return {
        sut
    }
}

describe('Db Athentication', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {

        const loadAccountByEmailRepositoryStub = makeloadAccountByEmailRepositoryStub()
        const {sut} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(makeFakeAthenticationModel())
        expect(loadSpy).toHaveBeenLastCalledWith(makeFakeAthenticationModel())
    })
})
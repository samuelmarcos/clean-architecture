import { DbAddAccount } from '../add-account/db-add-account'

const makeEncrypterStub = () => {
    class EncrypterStub {
        async encrypt(value: string) : Promise<string> {
            return new Promise(resolve => resolve('hashed_value'))
        }
    }
    return new EncrypterStub()
}

describe('DbAddAccount usecase', () => {
    test('should call Encrypterwith correct password', async () => {
        const encryptStub = makeEncrypterStub()
        const sut = new DbAddAccount(encryptStub)
        const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenLastCalledWith(accountData.password)
    })
})
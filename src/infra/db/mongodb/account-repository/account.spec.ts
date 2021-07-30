import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo respository', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('should return an account on success', async () => {
        const sut = new AccountMongoRepository()

        const account = await sut.add({
            name: "any_name",
            email: "any_email@email.com.br",
            password: "any_password",
        })

        expect(account).toBeTruthy()
        expect(account.name).toBe("any_name")
        expect(account.email).toBe("any_email@email.com.br")
        expect(account.password).toBe("any_password")
    })
})
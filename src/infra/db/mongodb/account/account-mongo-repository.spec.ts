import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo respository', () => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    test('should return an account on add success', async () => {
        const sut = makeSut()

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

    test('should return an account on loadByEmail success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne({ name: "any_name",
        email: "any_email@email.com.br",
        password: "any_password",})
        const account = await sut.loadByEmail("any_email@email.com.br")

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe("any_name")
        expect(account.email).toBe("any_email@email.com.br")
        expect(account.password).toBe("any_password")
    })

    test('should return an account on loadByEmail fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail("any_email@email.com.br")

        expect(account).toBeFalsy()
    })

    test('should update the account accesstoken on updateAcessToken success', async () => {
        const sut = makeSut()
        const res = await accountCollection.insertOne({ 
        name: "any_name",
        email: "any_email@email.com.br",
        password: "any_password",})

        const fakeAccount = res.ops[0]

        expect(fakeAccount.acessToken).toBeFalsy()
        await sut.updateAccessToken(fakeAccount._id, "any_token")
        const account = await accountCollection.findOne({ id: fakeAccount._id })
        expect(account).toBeTruthy()
        expect(account.acessToken).toBe( "any_token")
    })
})
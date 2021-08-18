import { MongoHelper as sut } from "./mongo-helper"

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL) 
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    test('should reconnect if mongo db is down', async () => {
        let accountCollevtion = await sut.getCollection('accounts')
        expect(accountCollevtion).toBeTruthy()
        await sut.disconnect()
        accountCollevtion = await sut.getCollection('accounts')
        expect(accountCollevtion).toBeTruthy()
    })
})
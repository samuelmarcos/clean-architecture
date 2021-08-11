import { MongoClient, Collection } from 'mongodb'
import { AccountModel } from '../../../../presentation/domain/models/account'


export const MongoHelper = {
    client: null as MongoClient,
    async connect(url: string | undefined) : Promise<void> {
        this.client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect(): Promise<void> {
        await this.client.close()
    },

    getCollection(name: string): Collection {
        return this.client.db().collection(name)
    },

    map(collection: any): any {
        const { _id,  ...collectionWithoutId} = collection
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}
import { MongoClient, Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'


export const MongoHelper = {
    client: null as MongoClient,
    url: null as any,
    
    async connect(url: string | undefined) : Promise<void> {
        this.client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect(): Promise<void> {
        await this.client.close()

        this.client = null
    },

    async getCollection(name: string): Promise<Collection> {
        if(!this.client?.isConnected())
            await this.connect(this.url)
        return this.client.db().collection(name)
    },

    map(collection: any): any {
        const { _id,  ...collectionWithoutId} = collection
        return Object.assign({}, collectionWithoutId, { id: _id })
    }
}
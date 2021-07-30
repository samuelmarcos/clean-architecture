import { MongoClient } from 'mongodb' 
import { disconnect } from 'node:process'

export const MongoHelper = {
    client: null as MongoClient,
    async connect(url: string | undefined) : Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },

    async disconnect(): Promise<void> {
        await this.client.close()
    }
}
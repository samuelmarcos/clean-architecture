import { LogErrorRepository } from '../../../../data/protocols/log-error-respository'
import { MongoHelper } from '../../mongodb/helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const errorCollection = await MongoHelper.getCollection('errors')
        errorCollection.insertOne({
            stack,
            date: new Date()
        })
    }
}
 
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-respository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccoountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAcessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { MongoHelper } from '../helpers/mongo-helper'


export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAcessTokenRepository, LoadAccoountByTokenRepository{
    async add(accountData: AddAccountParams): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        return MongoHelper.map(result.ops[0])
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account  = await accountCollection.findOne({ email })
        return account &&  MongoHelper.map(account)
    }

    async updateAccessToken(id: string , token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.updateOne({ _id: id }, { $set : { access_token: token }})
    }

    async loadByToken(token: string, role?: string): Promise<AccountModel | null> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account  = await accountCollection.findOne({ accessToken: token,
            $or:[{
                role
            }, {
                role: 'admin'
            }]
            })
        return account &&  MongoHelper.map(account)
    }
}
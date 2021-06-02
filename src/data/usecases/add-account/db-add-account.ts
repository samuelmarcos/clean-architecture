import { AddAccount, AddAccountModel } from '../../../presentation/domain/usecases/add-account'
import { AccountModel } from '../../../presentation/domain/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
    constructor(private readonly encrypter: Encrypter) {}

    async add(account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password)
        return new Promise( resolve => resolve(null))
    }
}
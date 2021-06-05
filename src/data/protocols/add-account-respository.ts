import { AccountModel } from '../../presentation/domain/models/account'
import { AddAccountModel } from '../../presentation/domain/usecases/add-account'

export interface AddAccountRepository {
    add(accountData: AddAccountModel): Promise<AccountModel>
}
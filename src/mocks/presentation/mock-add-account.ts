import { AccountModel } from "@/domain/models/account";
import { AddAccount, AddAccountParams } from "@/domain/usecases/account/add-account";
import { mockAccountModel } from "../domain";
import { LoadAccountByToken } from "@/presentation/middlewares/auth-middlewares-protocols";

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
      async add(account: AddAccountParams): Promise<AccountModel> {
          return new Promise(resolve => resolve(mockAccountModel()));
      }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
      public async load(accessToken: string, role?: string): Promise<AccountModel | null> {
          return new Promise((resolve) => {
              resolve(mockAccountModel())
          })
      }
  }   

  return new LoadAccountByTokenStub()
}
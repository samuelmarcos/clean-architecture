import { AccountModel } from "@/domain/models/account"
import { AddAccountParams } from "@/domain/usecases/account/add-account"

export const mockAccountModel = (): AccountModel => {
  return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
  }
}

export const mockAddAccountParams = (): AddAccountParams => {
  return {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
  }
}
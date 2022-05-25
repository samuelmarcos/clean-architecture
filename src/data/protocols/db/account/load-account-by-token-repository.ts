import { AccountModel } from "../../../usecases/add-account/db-add-account-protocols";

export interface LoadAccoountByTokenRepository {
    loadByToken(token: string, role?: string): Promise<AccountModel | null>
}
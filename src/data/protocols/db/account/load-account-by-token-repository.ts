import { AccountModel } from "@/domain/models/account"

export interface LoadAccoountByTokenRepository {
    loadByToken(token: string, role?: string): Promise<AccountModel>
}
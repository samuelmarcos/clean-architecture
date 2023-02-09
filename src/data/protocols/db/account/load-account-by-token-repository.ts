import { AccountModel } from '@/domain/models/account'
import { JwtPayload } from 'jsonwebtoken'

export interface LoadAccoountByTokenRepository {
    loadByToken(token: string | JwtPayload, role?: string): Promise<AccountModel | null>
}
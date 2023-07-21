import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adpter/jwt-adapter'
import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
   const jwtAdpter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbLoadAccountByToken(jwtAdpter, accountMongoRepository)
} 
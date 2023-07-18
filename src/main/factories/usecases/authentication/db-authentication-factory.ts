import env from '@/main/config/env'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adpter'
import { DbAuthentication } from '@/data/usecases/account/authentication/db.athentication'
import { Authentication } from '@/domain/usecases/account/authenctication'
import { JwtAdapter } from '@/infra/cryptography/jwt-adpter/jwt-adapter'

export const makeDbAuthentication = (): Authentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAuthentication(accountMongoRepository,bcryptAdapter, jwtAdapter,accountMongoRepository)
} 
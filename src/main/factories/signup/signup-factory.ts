import env from '../../config/env'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { DbAthentication } from '../../../data/usecases/authentication/db.athentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adpter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignupValidation } from './signup-validation-factory'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adpter/jwt-adapter'

export const makeSignupController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const dbAuthentication = new DbAthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
    const logMongoRepository = new LogMongoRepository()
    const signuptController =  new SignUpController(dbAddAccount, makeSignupValidation(), dbAuthentication)
    return new LogControllerDecorator(signuptController, logMongoRepository)
} 
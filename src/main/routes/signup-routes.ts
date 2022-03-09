import { Router } from 'express'
import { makeSignupController } from '../factories/signup/signup-factory'
import { adaptRoute } from '../adpaters/express-routes-adapter'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignupController()))
}
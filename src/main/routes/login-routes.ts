import { Router } from 'express'
import { adaptRoute } from '../adpaters/express/express-routes-adapter'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignupController } from '../factories/controllers/signup/signup-controller-factory'


export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignupController()))
    router.post('/login', adaptRoute(makeLoginController()))
}
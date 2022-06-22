import { Router } from 'express'
import { adaptMiddleware } from '../adpaters/express-middleware-adapter'
import { adaptRoute } from '../adpaters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'


export default (router: Router): void => {
    const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
    const auth = adaptMiddleware(makeAuthMiddleware())
    router.post('/surveys', adminAuth,  adaptRoute(makeAddSurveyController()))
    router.get('/surveys', auth , adaptRoute(makeLoadSurveyController()))
}
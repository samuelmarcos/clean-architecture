import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result-controller-factory/load-survey-result-controller-factory'

import { Router } from 'express'
import { adaptRoute } from '../adpaters/express-routes-adapter'
import { auth } from '../middlewares/auth'


export default (router: Router): void => {
    router.put('/surveys/:surveyId/results', auth,  adaptRoute(makeSaveSurveyResultController()))
    router.get('/surveys/:surveyId/results', auth,  adaptRoute(makeLoadSurveyResultController()))
}
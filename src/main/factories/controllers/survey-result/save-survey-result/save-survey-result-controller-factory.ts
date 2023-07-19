import { Controller } from "@/presentation/protocols"
import { SaveSurveyResultController } from "@/presentation/controllers/survey-result/save-survey-result-controller"
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeSaveSurveyResult } from "@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory"
import { makeDbLoadSeurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory"


export const makeSaveSurveyResultController = (): Controller => {
    const controller = new SaveSurveyResultController(makeDbLoadSeurveyById(), makeSaveSurveyResult())
    return makeLogControllerDecorator(controller)
} 
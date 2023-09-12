import { Controller } from "@/presentation/protocols"
import { LoadSurveyResultController } from "@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller"
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeLoadSurveyResult } from "@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory"
import { makeDbLoadSeurveyById } from "@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory"

export const makeLoadSurveyResultController = (): Controller => {
    const controller = new LoadSurveyResultController(makeDbLoadSeurveyById(), makeLoadSurveyResult())
    return makeLogControllerDecorator(controller)
} 
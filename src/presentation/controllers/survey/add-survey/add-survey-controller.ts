import { noContent, serverError } from "../../../helpers/http/http-helper"
import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from "./add-survey-controller-protocols"

export class AddSurveyController implements Controller {

    constructor(private readonly validation: Validation,
        private readonly addSurvey: AddSurvey) {}

    public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

        try {
            this.validation.validate(httpRequest.body)

            const { question, answers} = httpRequest.body

            await this.addSurvey.add({
                question,
                answers
            })

            return noContent()

        } catch (error) {
            return serverError(error)
        }
    }
}
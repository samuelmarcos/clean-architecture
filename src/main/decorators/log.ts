import { LogErrorRepository } from "../../data/protocols/log-error-respository"
import { SignUpController } from "../../presentation/controllers/signup/signup"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorator implements Controller {
    constructor(private readonly controller: Controller,
        private readonly logErrorRepository: LogErrorRepository) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httptResponse = await this.controller.handle(httpRequest)
        if(httptResponse.statusCode === 500)
            await this.logErrorRepository.logError(httptResponse.body.stack)
        return httptResponse
    }
}
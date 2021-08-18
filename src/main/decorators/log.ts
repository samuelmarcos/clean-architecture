import { SignUpController } from "../../presentation/controllers/signup/signup"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export class LogControllerDecorator implements Controller {
    constructor(private readonly controller: Controller) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httptResponse = await this.controller.handle(httpRequest)
        return httptResponse
    }
}
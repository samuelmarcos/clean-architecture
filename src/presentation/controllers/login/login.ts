import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/http-helper";
import {Validation } from "../signup/signup-protocols";
import { Controller, HttpRequest, HttpResponse, Authentication } from "./login-protocols";

export class LoginController implements Controller {
    constructor(private readonly authentication: Authentication,
        private readonly validation: Validation) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if(error) return badRequest(error)

            const { email, password } = httpRequest.body;

            const acccessToken = await this.authentication.auth({email, password})

            if(!acccessToken) return unauthorized()

            return ok({acccessToken})

        } catch (error) {
            return serverError(error)
        }

    }
}
import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
    constructor(private readonly emailValidator: EmailValidator) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['name', 'email', 'password', 'password_confirmation']

        for(let field of requiredFields) {
            if(!httpRequest.body[field])
                return new Promise(resolve => resolve(badRequest(new MissingParamError(field))))
        }

        const { email } = httpRequest.body;

        this.emailValidator.isValid(email)
    }
}
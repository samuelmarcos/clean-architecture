import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError, unauthorized } from "../../helpers/http-helper";
import { EmailValidator } from "../signup/signup-protocols";
import { Controller, HttpRequest, HttpResponse, Authentication } from "./login-protocols";

export class LoginController implements Controller {
    constructor(private readonly emailValidator: EmailValidator,
        private readonly authentication: Authentication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']

            for(let field of requiredFields) {
                if(!httpRequest.body[field])
                    return badRequest(new MissingParamError(field))
            }

            const { email, password } = httpRequest.body;

            const isValid = this.emailValidator.isValid(email)

            if(!isValid) return badRequest(new InvalidParamError('email'))

            const acccessToken = await this.authentication.auth(email, password)

            if(!acccessToken) return unauthorized()

            return new Promise(resolve => resolve({
                statusCode: 200,
                body: 'hello'
            }))

        } catch (error) {
            return serverError(error)
        }

    }
}
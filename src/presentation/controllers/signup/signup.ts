import { HttpRequest, HttpResponse, Controller, EmailValidator } from "../signup/signup-protocols"
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from "../../errors"
import { AddAccount } from "../../../domain/usecases/add-account"
import { Validation } from "../../helpers/validators/validation"

export class SignUpController implements Controller {
    constructor(private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount,
        private readonly validation: Validation ){}

    public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {

            const error = this.validation.validate(httpRequest.body)

            if(error) return badRequest(error)

            const { name, email, password } = httpRequest.body;
            
            const isValid = this.emailValidator.isValid(email)
            
            if(!isValid) return badRequest(new InvalidParamError('email'))

            const account = await this.addAccount.add({ name, email, password})

            return ok(account)

        } catch (error) {
            return serverError(error)
        }
    }
}
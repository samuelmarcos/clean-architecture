import { HttpRequest, HttpResponse, Controller, EmailValidator} from "../protocols"
import { badRequest, serverError } from '../helpers/http-helper'
import { InvalidParamError, MissingParamError } from "../errors"
import { AddAccount } from "../domain/usecases/add-account"

export class SignUpController implements Controller {
    constructor(private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount ){}

    public handle(httpRequest: HttpRequest): any {
        try {
            const requiredFields = ['name', 'email', 'password', 'password_confirmation']

            for (const field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { name, email, password, password_confirmation } = httpRequest.body;

            if (password !== password_confirmation) {
                return badRequest(new InvalidParamError('password_confirmation'))
            }
            
            const isValid = this.emailValidator.isValid(email)
            if(!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            this.addAccount.add({ name, email, password})
            
        } catch (error) {
            return serverError()
        }
    }
}
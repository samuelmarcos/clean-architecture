import { HttpRequest, HttpResponse, Controller, EmailValidator} from "../protocols"
import { badRequest, serverError } from '../helpers/http-helper'
import { InvalidParamError, MissingParamError } from "../errors"

export class SignUpController implements Controller {
    constructor(private readonly emailValidator: EmailValidator){}

    public handle(httpRequest: HttpRequest): any {
        try {
            const requiredFields = ['name', 'email', 'password', 'password_confirmation']

            for (const field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            if (httpRequest.body.password !== httpRequest.body.password_confirmation) {
                return badRequest(new InvalidParamError('password_confirmation'))
            }
            
            const isValid = this.emailValidator.isValid(httpRequest.body.email)
            if(!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (error) {
            return serverError()
        }
    }
}
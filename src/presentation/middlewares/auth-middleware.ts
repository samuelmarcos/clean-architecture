import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";


export class AuthMiddleware implements Middleware {
    public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise((resolve) => {
            resolve(forbidden(new AccessDeniedError()))
        })
    }
}
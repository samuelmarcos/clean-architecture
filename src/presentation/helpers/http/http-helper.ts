import { ServerError,  UnauthorizedError } from "../../errors"
import { HttpResponse } from "../../protocols/http"

export const badRequest = (error: Error): HttpResponse => {
    return {
        statusCode: 400,
        body: error
    }
}

export const forbidden = (error: Error): HttpResponse => {
    return {
        statusCode: 403,
        body: error
    }
}

export const serverError = (error: Error): HttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError(error.stack!)
    }
}

export const ok = (data: any): HttpResponse => {
    return {
        statusCode: 200,
        body: data
    }
}

export const noContent = (): HttpResponse => {
    return {
        statusCode: 204,
        body: null
    }
}

export const unauthorized = () => {
    return {
        statusCode: 401,
        body: new UnauthorizedError()
    }
}
import { MissingParamError } from "../errors/missing-param-error"
import { SignUpController } from "./signup"

describe('Signup Controller', () => {
    test('should return 400 if no name is provided', () => {
        const sut = new SignUpController()

        const httpRequest = {
            body: {
                email: 'any_email',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no name is provided', () => {
        const sut = new SignUpController()

        const httpRequest = {
            body: {
                name: 'any_email',
                password: 'any_password',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no name is provided', () => {
        const sut = new SignUpController()

        const httpRequest = {
            body: {
                name: 'any_email',
                email: 'any_email',
                password_confirmation: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no name is provided', () => {
        const sut = new SignUpController()

        const httpRequest = {
            body: {
                name: 'any_email',
                email: 'any_email',
                password: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
    })
})
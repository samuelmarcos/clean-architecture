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
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
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
        expect(httpResponse.body).toEqual(new Error('Missing param: email'))
    })
})
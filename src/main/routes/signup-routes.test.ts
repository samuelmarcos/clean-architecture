import request from 'supertest'
import app from '../config/app'

describe('Signup routes', () => {
    test('should return an account on success', async () => {
        app.post('api/signup', (req, res) => res.send(req.body))
        await request(app)
            .post('/api/signup')
            .send({
                name: 'any_name',
                email: 'any_email@email.com.br',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            })
            .expect(200)
    })
})
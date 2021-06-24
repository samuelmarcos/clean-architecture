import bcrypt, { hash } from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adpter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))

describe('Bcrypt Adapter', () => {
    test('should call bcrypt with correct value', async () => {
        const salt = 12
        const sut  = new BcryptAdapter(salt)
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
    })

    test('should return a hash on success', async () => {
        const salt = 12
        const sut = new BcryptAdapter(salt)
    
        const hashedValue = await sut.encrypt('any_value')
        expect(hashedValue).toBe('hash')
    })
})
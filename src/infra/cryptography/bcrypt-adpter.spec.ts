import bcrypt, { hash } from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adpter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))
const salt = 12
const makeSut = () => {
    return  new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('should call bcrypt with correct value', async () => {
        const sut  = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
    })

    test('should return a hash on success', async () => {
        const sut  = makeSut()
    
        const hashedValue = await sut.encrypt('any_value')
        expect(hashedValue).toBe('hash')
    })
})
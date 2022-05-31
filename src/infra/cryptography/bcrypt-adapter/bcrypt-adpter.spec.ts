import bcrypt, { hash } from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adpter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    },

    async compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))

const salt = 12
const makeSut = () => {
    return  new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    describe('hash()', () => {
        test('should call hash with correct value', async () => {
            const sut  = makeSut()
            const hashSpy = jest.spyOn(bcrypt, 'hash')
            await sut.hash('any_value')
            expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
        })
    
        test('should return a valid hash on hash success', async () => {
            const sut  = makeSut()
        
            const hashedValue = await sut.hash('any_value')
            expect(hashedValue).toBe('hash')
        })
    
        test('should call compare with correct value', async () => {
            const sut  = makeSut()
            const comparehSpy = jest.spyOn(bcrypt, 'compare')
            await sut.compare('any_value', 'any_hash')
            expect(comparehSpy).toHaveBeenLastCalledWith('any_value', 'any_hash')
        })
    })
    describe('compare()', () => {
        test('should return true whrn compare success', async () => {
            const sut  = makeSut()
            const isValid = await sut.compare('any_value', 'any_hash')
            expect(isValid).toBe(true)
        })
    })
})
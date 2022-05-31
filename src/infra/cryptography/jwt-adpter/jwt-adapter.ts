import jwt from 'jsonwebtoken';
import { Decrypter } from '../../../data/protocols/cryptography/decrypter';
import { Encrypter } from "../../../data/protocols/cryptography/encrypter";


export class JwtAdapter implements Encrypter, Decrypter {
    constructor(private readonly secret: string) {}

    public async encrypt(value: string ): Promise<string> {
        return await jwt.sign({id: value}, this.secret)   
    }

    public async decrypt(value: string): Promise<string | null> {
        await jwt.verify(value, this.secret)
        return null
    }
}
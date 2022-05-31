import jwt, { JwtPayload } from 'jsonwebtoken';
import { Decrypter } from '../../../data/protocols/cryptography/decrypter';
import { Encrypter } from "../../../data/protocols/cryptography/encrypter";


export class JwtAdapter implements Encrypter, Decrypter {
    constructor(private readonly secret: string) {}

    public async encrypt(value: string ): Promise<string> {
        return await jwt.sign({id: value}, this.secret)   
    }

    public async decrypt(token: string): Promise<string | JwtPayload> {
        const value = await jwt.verify(token, this.secret)
        return value
    }
}
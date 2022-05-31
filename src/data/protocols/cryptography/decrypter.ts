import { JwtPayload } from "jsonwebtoken";

export interface Decrypter {
    decrypt(value: string ): Promise<string | JwtPayload> 
}
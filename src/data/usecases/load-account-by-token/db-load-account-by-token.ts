import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { Decrypter } from "../../protocols/cryptography/decrypter";
import { LoadAccoountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";


export class DbLoadAccountByToken implements LoadAccountByToken {

    constructor(private readonly decrypter: Decrypter,
                private readonly loadAccoountByTokenRepository: LoadAccoountByTokenRepository) {}

    public async load(accessToken: string, role?: string): Promise<AccountModel | null> {
        const decryptedToken = await this.decrypter.decrypt(accessToken)
        if(decryptedToken) {
            return await this.loadAccoountByTokenRepository.loadByToken(decryptedToken!, role)
        
        }
        return null
    }
}
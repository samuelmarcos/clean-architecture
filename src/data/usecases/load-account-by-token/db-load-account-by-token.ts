import { LoadAccountByToken } from "@/domain/usecases/load-account-by-token";
import { Decrypter } from "@/data/protocols/cryptography/decrypter";
import { LoadAccoountByTokenRepository } from "@/data/protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "@/domain/models/account";


export class DbLoadAccountByToken implements LoadAccountByToken {

    constructor(private readonly decrypter: Decrypter,
                private readonly loadAccoountByTokenRepository: LoadAccoountByTokenRepository) {}

    public async load(accessToken: string, role?: string): Promise<AccountModel | null> {
        const decryptedToken = await this.decrypter.decrypt(accessToken)
        if(decryptedToken) {
            const account =  await this.loadAccoountByTokenRepository.loadByToken(decryptedToken!, role)
            if(account) {
                return account
            }
        }
        return null
    }
}
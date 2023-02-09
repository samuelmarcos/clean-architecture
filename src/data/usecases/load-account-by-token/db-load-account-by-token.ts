import { LoadAccountByToken, AccountModel, LoadAccoountByTokenRepository, Decrypter } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {

    constructor(private readonly decrypter: Decrypter,
                private readonly loadAccoountByTokenRepository: LoadAccoountByTokenRepository) {}

    public async load(accessToken: string, role?: string): Promise<AccountModel | null> {
        const decryptedToken = await this.decrypter.decrypt(accessToken)
        if(decryptedToken) {
            const account =  await this.loadAccoountByTokenRepository.loadByToken(decryptedToken, role)
            if(account) {
                return account
            }
        }
        return null
    }
}
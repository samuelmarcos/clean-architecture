import {Authentication,
    LoadAccountByEmailRepository, 
    TokenGenerator, 
    UpdateAcessTokenRepository, 
    HashCompare, 
    AthenticationModel } from "./db.athentication.protocols"

export class DbAthentication implements Authentication {
    constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
                private readonly hashCompare: HashCompare, 
                private readonly tokenGenerator: TokenGenerator,
                private readonly updateAcessTokenRepository: UpdateAcessTokenRepository) {}

    async auth(authentication: AthenticationModel): Promise<string | null> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if(account) {
            const isValid = await this.hashCompare.compare(authentication.password, account!.password)
            if(isValid) {
                const acess_token = await this.tokenGenerator.generate(account.id)
                await this.updateAcessTokenRepository.update(account.id, acess_token)
                return acess_token
            }
        }
        return null
    }
    
}
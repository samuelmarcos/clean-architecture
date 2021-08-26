import { AthenticationModel, Authentication } from "../../../domain/usecases/authenctication";
import { HashCompare } from "../../protocols/cryptography/hash-compre";
import { TokenGenerator } from "../../protocols/cryptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { UpdateAcessTokenRepository } from "../../protocols/db/update-access-token-repository";

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
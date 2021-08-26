import { AthenticationModel, Authentication } from "../../../domain/usecases/authenctication";
import { HashCompare } from "../../protocols/cryptography/hash-compre";
import { TokenGenerator } from "../../protocols/cryptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";

export class DbAthentication implements Authentication {
    constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
                private readonly hashCompare: HashCompare, 
                private readonly tokenGenerator: TokenGenerator) {}

    async auth(authentication: AthenticationModel): Promise<string | null> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if(account) {
            await this.hashCompare.compare(authentication.password, account!.password)
            await this.tokenGenerator.generate(account.id)
        }
        return null
    }
    
}
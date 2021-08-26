import { AthenticationModel, Authentication } from "../../../domain/usecases/authenctication";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";

export class DbAthentication implements Authentication {
    constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

    async auth(authentication: AthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email)
        return ''
    }
    
}
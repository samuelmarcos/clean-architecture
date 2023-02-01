export type AthenticationModel = {
    email: string,
    password: string
}


export interface Authentication {
    auth(authentication: AthenticationModel): Promise<string | null>
}
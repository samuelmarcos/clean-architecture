export type AthenticationParams = {
    email: string,
    password: string
}


export interface Authentication {
    auth(authentication: AthenticationParams): Promise<string | null>
}
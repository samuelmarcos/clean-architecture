export interface UpdateAcessTokenRepository {
    updateAccessToken(id: string , acess_token: string): Promise<void>
}
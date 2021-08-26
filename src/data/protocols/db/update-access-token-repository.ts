export interface UpdateAcessTokenRepository {
    update(id: string , acess_token: string): Promise<void>
}
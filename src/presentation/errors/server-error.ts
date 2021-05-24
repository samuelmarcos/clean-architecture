
export class ServerError extends Error {
    constructor() {
        super(`Internal server error, try later`)
        this.name = 'ServerError'
    }
}
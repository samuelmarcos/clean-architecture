
export class ServerError extends Error {
    constructor(stack: string) {
        super(`Internal server error, try later`)
        this.name = 'ServerError'
        this.stack = stack
    }
}
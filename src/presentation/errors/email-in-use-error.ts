
export class EmailInUseError extends Error {
    constructor() {
        super('The received Email is already in use')
        this.name = 'EmailInUseError'
    }
}
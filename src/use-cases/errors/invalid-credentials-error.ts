export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid user credentials.')
  }
}

export class CompanyAlreadyExistsError extends Error {
  constructor() {
    super('Company is already exists')
  }
}

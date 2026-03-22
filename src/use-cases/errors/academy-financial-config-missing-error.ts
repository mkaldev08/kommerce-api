export class AcademyFinancialConfigMissingError extends Error {
  constructor(message?: string) {
    super(message ?? "Academy financial configuration is missing.");
  }
}
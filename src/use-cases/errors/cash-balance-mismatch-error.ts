export class CashBalanceMismatchError extends Error {
  constructor() {
    super('Closing balance does not match expected balance.')
  }
}

export class PaymentExceedsTotalError extends Error {
  constructor() {
    super('Payment amount exceeds invoice total.')
  }
}

export class GamingSessionPaymentExceedsTotalError extends Error {
  constructor() {
    super("O pagamento excede o total da sessao.");
  }
}

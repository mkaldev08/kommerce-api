export class GamingSessionAlreadyEndedError extends Error {
  constructor() {
    super("A sessao ja foi encerrada.");
  }
}
